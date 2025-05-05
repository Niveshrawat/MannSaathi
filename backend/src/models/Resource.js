const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  type: {
    type: String,
    enum: ['article', 'video', 'podcast', 'exercise'],
    required: [true, 'Please specify the resource type']
  },
  category: {
    type: String,
    enum: ['Article', 'Video', 'Podcast', 'Exercise'],
    required: [true, 'Please specify the resource category']
  },
  url: {
    type: String
  },
  imageUrl: {
    type: String
  },
  duration: {
    type: Number // in minutes
  },
  author: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Resource must belong to a counselor']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt timestamp before saving
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resource', resourceSchema); 