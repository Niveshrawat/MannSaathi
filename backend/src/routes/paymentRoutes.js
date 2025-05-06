const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.use(protect);

// Process payment for a booking
router.post('/process', paymentController.processPayment);

// Verify payment status
router.get('/verify/:paymentId', paymentController.verifyPayment);

module.exports = router; 