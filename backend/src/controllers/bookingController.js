const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const sendEmail = require('../../utils/sendEmail');

// User books a slot
exports.createBooking = async (req, res) => {
  try {
    const { slotId, notes } = req.body;
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }
    // Mark slot as booked
    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    await slot.save();
    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      counselor: slot.counselor,
      slot: slot._id,
      notes
    });
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