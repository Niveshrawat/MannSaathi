const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  type: {
    type: String,
    enum: ['chat', 'audio'],
    required: true
  },
  sessionId: {
    type: String,
    default: null
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 