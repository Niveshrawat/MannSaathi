const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');
const Session = require('../models/Session');

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

// Fetch session by booking id
router.get('/session/byBooking/:bookingId', async (req, res) => {
  try {
    const session = await Session.findOne({ booking: req.params.bookingId })
      .populate('user', 'name profilePicture')
      .populate('counselor', 'name profilePicture');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session' });
  }
});

module.exports = router; 