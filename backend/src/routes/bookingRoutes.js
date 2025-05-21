const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');
const Session = require('../models/Session');
const Booking = require('../models/Booking');

router.use(protect);

// User books a slot
router.post('/', bookingController.createBooking);
// User: get my bookings
router.get('/my', bookingController.getMyBookings);
// Counselor: get bookings for me
router.get('/counselor', bookingController.getCounselorBookings);
// Counselor: update booking status (accept/reject/cancel)
router.put('/:id/status', bookingController.updateBookingStatus);
// Mark booking as completed
router.put('/:id/complete', bookingController.markBookingCompleted);

// Submit feedback for a booking
router.post('/:id/feedback', async (req, res) => {
  console.log('Feedback route hit for booking:', req.params.id, 'body:', req.body);
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Session not completed yet' });
    if (booking.feedback && booking.feedback.rating) return res.status(400).json({ message: 'Feedback already submitted' });
    
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });
    
    booking.feedback = { rating, comment };
    await booking.save();
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Fetch session by booking id
router.get('/session/byBooking/:bookingId', async (req, res) => {
  try {
    // Populate slot for extension options
    const booking = await Booking.findById(req.params.bookingId).populate('slot');
    const session = await Session.findOne({ booking: req.params.bookingId })
      .populate('user', 'name profilePicture')
      .populate('counselor', 'name profilePicture');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    // Convert session to plain object and attach slot
    const sessionObj = session.toObject();
    if (booking && booking.slot) {
      sessionObj.slot = booking.slot;
    }
    res.json(sessionObj);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session' });
  }
});

module.exports = router; 