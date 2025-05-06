const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const journalRoutes = require('./routes/journalRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
// index.js or app.js (at the top)
require('dotenv').config();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://mannsaathi.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

console.log('SENDMAIL DEBUG:', process.env.EMAIL_USER, process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

module.exports = app; 