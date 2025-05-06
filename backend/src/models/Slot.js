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
    enum: ['video', 'chat'],
    default: 'video'
  },
  price: {
    type: Number,
    required: true
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Slot', slotSchema); 