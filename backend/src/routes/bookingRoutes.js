const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

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

module.exports = router; 