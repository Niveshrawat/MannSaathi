const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Booking = require('./models/Booking');
const Slot = require('./models/Slot');
const Session = require('./models/Session');
const express = require('express');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for security
    methods: ['GET', 'POST']
  }
});

// Track active sessions
const activeSessions = new Map();

// Auto-end expired sessions
setInterval(() => {
  const now = new Date();
  for (const [bookingId, endTime] of activeSessions.entries()) {
    if (now >= endTime) {
      const room = `chat_${bookingId}`;
      io.to(room).emit('sessionEnded', { message: 'Session time has ended' });
      Booking.findByIdAndUpdate(bookingId, { status: 'completed' }).exec();
      activeSessions.delete(bookingId);
    }
  }
}, 60000);

io.on('connection', (socket) => {
  console.log('Socket connection handler running for:', socket.id);

  socket.onAny((event, ...args) => {
    console.log('Received event:', event, 'with args:', args);
  });

  // Authenticate user via JWT sent in query
  socket.on('joinRoom', async ({ token, bookingId }, callback) => {
    console.log('joinRoom event received', { token, bookingId });
    try {
      if (!token || !bookingId) {
        console.log('Missing token or bookingId', { token, bookingId });
        return callback({ success: false, message: 'Missing token or bookingId' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      // Find booking and slot
      const booking = await Booking.findById(bookingId).populate('slot');
      if (!booking || booking.status !== 'accepted' || booking.type !== 'chat') {
        console.log('Invalid or inactive chat booking', { booking });
        return callback({ success: false, message: 'Invalid or inactive chat booking' });
      }

      // Only user or counselor can join
      if (booking.user.toString() !== userId && booking.counselor.toString() !== userId) {
        console.log('Not authorized for this chat', { userId, bookingUser: booking.user, bookingCounselor: booking.counselor });
        return callback({ success: false, message: 'Not authorized for this chat' });
      }

      // Debug logs for slot info
      console.log('booking.slot:', booking.slot);
      console.log('slot.date:', booking.slot?.date);
      console.log('slot.startTime:', booking.slot?.startTime);
      console.log('slot.endTime:', booking.slot?.endTime);

      // Check if current time is within slot time
      const now = new Date();
      const slotDate = booking.slot.date;
      const start = new Date(`${slotDate}T${booking.slot.startTime}`);
      const end = new Date(`${slotDate}T${booking.slot.endTime}`);
      console.log('start:', start, 'end:', end, 'now:', now);

      if (now < start) {
        console.log('Chat session has not started yet', { now, start });
        return callback({ success: false, message: 'Chat session has not started yet' });
      }
      
      if (now > end) {
        console.log('Chat session has ended', { now, end });
        return callback({ success: false, message: 'Chat session has ended' });
      }

      // Calculate time remaining
      const timeRemaining = Math.floor((end - now) / (1000 * 60));
      console.log('minutesRemaining:', timeRemaining);

      // Join room
      const room = `chat_${bookingId}`;
      socket.join(room);
      socket.data.userId = userId;
      socket.data.bookingId = bookingId;

      // Store session end time
      activeSessions.set(bookingId, end);

      // Send chat history
      const session = await Session.findOne({ booking: bookingId });
      if (session && session.messages) {
        socket.emit('chatHistory', session.messages);
      }

      // Send time remaining
      socket.emit('timeRemaining', { minutesRemaining: timeRemaining });

      callback({ 
        success: true, 
        message: 'Joined chat room', 
        room,
        timeRemaining: timeRemaining,
        sessionEndTimestamp: end.getTime()
      });
    } catch (err) {
      callback({ success: false, message: 'Auth or join error' });
    }
  });

  // Handle chat messages
  socket.on('chatMessage', async ({ bookingId, message }) => {
    const room = `chat_${bookingId}`;
    if (!socket.data.bookingId || socket.data.bookingId !== bookingId) return;

    // Check if session is still active
    const endTime = activeSessions.get(bookingId);
    if (!endTime || new Date() > endTime) {
      socket.emit('error', { message: 'Session has ended' });
      return;
    }

    const msgObj = {
      sender: socket.data.userId,
      content: message,
      timestamp: new Date()
    };

    // Save to DB
    await Session.findOneAndUpdate(
      { booking: bookingId },
      { $push: { messages: msgObj } }
    );
    io.to(room).emit('chatMessage', msgObj);
  });

  socket.on('finishSession', async ({ bookingId }) => {
    console.log('Received finishSession for bookingId:', bookingId, 'by userId:', socket.data.userId);
    const booking = await Booking.findById(bookingId).populate('slot');
    if (!booking) {
      console.log('Booking not found for bookingId:', bookingId);
      return;
    }
    console.log('Booking.user:', booking.user.toString(), 'socket userId:', socket.data.userId);
    if (booking.user.toString() !== socket.data.userId) {
      console.log('Only the user can end the session. Not allowed for:', socket.data.userId);
      return;
    }
    // Mark session as completed
    await Booking.findByIdAndUpdate(bookingId, { status: 'completed' });
    if (booking && booking.slot) {
      await Slot.findByIdAndUpdate(booking.slot._id, { status: 'completed', isBooked: true });
    }
    // Notify all in room
    const room = `chat_${bookingId}`;
    io.to(room).emit('sessionEnded', { message: 'Session was ended by the user.', endedByUser: true });
    console.log('Session ended and notified room:', room);
  });

  socket.on('testEvent', (data) => {
    console.log('Test event received:', data, 'from socket:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

module.exports = { io }; 

app.post('/api/bookings/:id/feedback', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Session not completed yet' });
    if (booking.feedback && booking.feedback.rating) return res.status(400).json({ message: 'Feedback already submitted' });
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });
    booking.feedback = { rating, comment };
    await booking.save();
    res.json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
}); 