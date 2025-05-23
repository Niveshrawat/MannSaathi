const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// Process payment for a booking
exports.processPayment = async (req, res) => {
  try {
    const { amount, bookingId, currency, isExtension, extensionOptionIndex } = req.body;
    
    // Verify the booking exists and belongs to the user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    }).populate('slot');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found or already processed' 
      });
    }

    if (isExtension) {
      const extensionOption = booking.slot.extensionOptions[extensionOptionIndex];
      if (!extensionOption) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid extension option' 
        });
      }
      if (amount !== extensionOption.cost) {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment amount does not match extension price' 
        });
      }
    } else {
      if (amount !== booking.slot.price) {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment amount does not match booking price' 
        });
      }
    }

    // Here you would integrate with your payment gateway (e.g., Stripe, PayPal)
    // For now, we'll simulate a successful payment
    const paymentId = `pay_${Date.now()}`;

    // Update booking status
    booking.status = 'pending';
    booking.paymentStatus = 'paid';
    booking.paymentId = paymentId;
    await booking.save();

    // Update slot status
    const slot = await Slot.findById(booking.slot._id);
    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    await slot.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      paymentId
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed' 
    });
  }
};

// Verify payment status
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const booking = await Booking.findOne({
      paymentId,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.status(200).json({
      success: true,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed' 
    });
  }
}; 