const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const sendEmail = require('../../utils/sendEmail');
const Session = require('../models/Session');

// User books a slot
exports.createBooking = async (req, res) => {
  try {
    const { slotId, notes } = req.body;
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }
    // 1. Check if user already has 3 bookings for that day (pending/accepted)
    const userBookingsForDay = await Booking.countDocuments({
      user: req.user.id,
      status: { $in: ['pending', 'accepted'] },
      // Populate slot to check date
    }).populate({
      path: 'slot',
      match: { date: slot.date }
    });
    if (userBookingsForDay >= 3) {
      return res.status(400).json({ success: false, message: 'You can only book up to 3 slots per day.' });
    }
    // 2. Check for overlapping bookings (same date, overlapping time)
    const userBookings = await Booking.find({
      user: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    }).populate('slot');
    const isOverlap = userBookings.some(b =>
      b.slot &&
      b.slot.date === slot.date &&
      ((slot.startTime >= b.slot.startTime && slot.startTime < b.slot.endTime) ||
       (slot.endTime > b.slot.startTime && slot.endTime <= b.slot.endTime) ||
       (slot.startTime <= b.slot.startTime && slot.endTime >= b.slot.endTime))
    );
    if (isOverlap) {
      return res.status(400).json({ success: false, message: 'You have an overlapping booking.' });
    }
    // Mark slot as booked
    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    slot.status = 'booked';
    await slot.save();
    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      counselor: slot.counselor,
      slot: slot._id,
      notes,
      type: slot.sessionType
    });
    // Update slot with bookingId
    slot.bookingId = booking._id;
    await slot.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('slot')
      .populate('counselor', 'name email profilePicture');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for logged-in counselor
exports.getCounselorBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ counselor: req.user.id })
      .populate('slot')
      .populate('user', 'name email profilePicture');
    // Auto-complete sessions if end time has passed
    const now = new Date();
    for (const booking of bookings) {
      if (
        booking.status === 'accepted' &&
        booking.slot &&
        booking.slot.endTime &&
        new Date(booking.slot.date + 'T' + booking.slot.endTime) < now
      ) {
        booking.status = 'completed';
        await booking.save();
      }
    }
    // Refetch to get updated statuses
    bookings = await Booking.find({ counselor: req.user.id })
      .populate('slot')
      .populate('user', 'name email profilePicture');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Counselor: update booking status (accept/reject/cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const booking = await Booking.findById(id)
      .populate('slot')
      .populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // Only counselor can update their own bookings
    if (booking.counselor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = status;
    if (status === 'accepted' && !booking.sessionId) {
      booking.sessionId = booking._id.toString();
      // Create a session document
      await Session.create({
        booking: booking._id,
        appointment: booking.slot,
        user: booking.user,
        counselor: booking.counselor,
        type: booking.type,
        status: 'scheduled',
        startTime: null,
        endTime: null,
        messages: [],
        notes: ''
      });
    }
    if (status === 'rejected' && reason) {
      booking.rejectionReason = reason;
    }
    await booking.save();
    // If rejected, make slot available again
    if (status === 'rejected' && booking.slot) {
      booking.slot.isBooked = false;
      booking.slot.bookedBy = null;
      await booking.slot.save();
    }
    // Send email notification to user
    const userEmail = booking.user.email || '';
    console.log('--- EMAIL DEBUG START ---');
    console.log('Booking status:', booking.status);
    console.log('Booking user:', booking.user);
    console.log('User email to notify:', userEmail);
    console.log('EMAIL_USER (env):', process.env.EMAIL_USER);
    console.log('EMAIL_PASS (env):', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    const subject = 'Your Booking Was Rejected';
    const text = `Your booking for ${booking.slot?.date} at ${booking.slot?.startTime} was rejected by the counselor.${reason ? '\nReason: ' + reason : ''}`;
    const html = `<p>Your booking for <b>${booking.slot?.date} at ${booking.slot?.startTime}</b> was <b>rejected</b> by the counselor.</p>${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}`;
    if (userEmail) {
      try {
        await sendEmail({ to: userEmail, subject, text, html });
        console.log('Rejection email sent to:', userEmail);
      } catch (e) {
        console.error('Failed to send rejection email:', e);
      }
    } else {
      console.log('No user email found, email not sent.');
    }
    console.log('--- EMAIL DEBUG END ---');
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Counselor or system: mark booking as completed
exports.markBookingCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // Only counselor or system can mark as completed
    if (booking.counselor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = 'completed';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 