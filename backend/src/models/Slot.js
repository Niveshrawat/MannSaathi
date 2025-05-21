const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String, // Format: HH:mm
    required: true
  },
  endTime: {
    type: String, // Format: HH:mm
    required: true
  },
  sessionType: {
    type: String,
    enum: ['audio', 'chat'],
    default: 'audio'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'cancelled'],
    default: 'available'
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  extensionOptions: [
    {
      duration: { type: Number, required: true }, // in minutes
      cost: { type: Number, required: true } // price for this extension
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Slot', slotSchema); 