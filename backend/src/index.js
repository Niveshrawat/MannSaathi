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
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Track active sessions
const activeSessions = new Map();

// Track which sessions have already been extended
const sessionExtensionUsed = new Map();

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
      const userRole = decoded.role; // Make sure your JWT includes the role
      
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

      // Join user/counselor rooms for real-time events
      // Always join user room
      const userRoom = `user_${booking.user.toString()}`;
      socket.join(userRoom);
      console.log('User joined room:', userRoom, 'socket.id:', socket.id);
      // Always join counselor room
      const counselorRoom = `counselor_${booking.counselor.toString()}`;
      socket.join(counselorRoom);
      console.log('Counselor joined room:', counselorRoom, 'socket.id:', socket.id);
      // Always join the chat room for this booking
      const room = `chat_${bookingId}`;
      socket.join(room);
      socket.data.userId = userId;
      socket.data.bookingId = bookingId;

      // Debug logs for slot info
      console.log('booking.slot:', booking.slot);
      console.log('slot.date:', booking.slot?.date);
      console.log('slot.startTime:', booking.slot?.startTime);
      console.log('slot.endTime:', booking.slot?.endTime);

      // Check if current time is within slot time
      const now = new Date();
      const slotDate = booking.slot.date;
      
      // Convert slot times to UTC for comparison
      const start = new Date(`${slotDate}T${booking.slot.startTime}:00Z`);
      const end = new Date(`${slotDate}T${booking.slot.endTime}:00Z`);
      
      console.log('Time comparison:', {
        now: now.toISOString(),
        start: start.toISOString(),
        end: end.toISOString(),
      });

      // Allow joining 5 minutes before start time
      if (now >= start && now <= end) {
        // User is within the session time, proceed
      } else if (now < start) {
        console.log('Chat session has not started yet', { now, start });
        return callback({ success: false, message: 'Chat session has not started yet' });
      }
      
      // Allow joining up to 5 minutes after end time
      else if (now > end) {
        console.log('Chat session has ended', { now, end });
        return callback({ success: false, message: 'Chat session has ended' });
      }

      // Calculate time remaining (including grace period)
      const timeRemaining = Math.max(0, Math.floor((end - now) / (1000 * 60)));
      console.log('minutesRemaining:', timeRemaining);

      // Store session end time (including grace period)
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

    try {
      // Get booking and slot info
      const booking = await Booking.findById(bookingId).populate('slot');
      if (!booking) {
        socket.emit('error', { message: 'Booking not found' });
        return;
      }

      const now = new Date();
      const slotDate = booking.slot.date;
      const start = new Date(`${slotDate}T${booking.slot.startTime}:00Z`);
      const end = new Date(`${slotDate}T${booking.slot.endTime}:00Z`);
      
      // Add grace periods
      const gracePeriodStart = new Date(start.getTime() - 5 * 60 * 1000);
      const gracePeriodEnd = new Date(end.getTime() + 5 * 60 * 1000);

      // Check if within grace periods
      if (now < gracePeriodStart || now > gracePeriodEnd) {
        socket.emit('error', { message: 'Session is not active' });
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
        { $push: { messages: msgObj } },
        { upsert: true }
      );

      // Emit to room
      io.to(room).emit('chatMessage', msgObj);
    } catch (err) {
      console.error('Error in chatMessage:', err);
      socket.emit('error', { message: 'Error sending message' });
    }
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
    sessionExtensionUsed.delete(bookingId);
  });

  socket.on('testEvent', (data) => {
    console.log('Test event received:', data, 'from socket:', socket.id);
  });

  socket.on('testCounselorEvent', (data) => {
    console.log('testCounselorEvent received:', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Session Extension Events
  socket.on('requestExtension', async (payload, callback) => {
    try {
      const booking = await Booking.findById(payload.bookingId)
        .populate('slot')
        .populate('user')
        .populate('counselor');
      
      if (!booking) {
        console.log('DEBUG: Returning early - Booking not found');
        return callback({ success: false, message: 'Booking not found' });
      }

      // Only user can request extension
      let socketUserId = (typeof payload !== 'undefined' && payload.userId) ? payload.userId : socket.data.userId;
      if (!socketUserId) {
        // Try to get userId from JWT in handshake headers (for fallback)
        try {
          const token = socket.handshake.query.token || (socket.handshake.headers && socket.handshake.headers.authorization && socket.handshake.headers.authorization.replace('Bearer ', ''));
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socketUserId = decoded.id;
          }
        } catch (jwtErr) {
          console.log('DEBUG: Could not decode JWT for fallback userId', jwtErr);
        }
      }
      if (!socketUserId) {
        console.log('DEBUG: Returning early - No userId available for permission check');
        return callback({ success: false, message: 'User not authenticated' });
      }
      const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
      if (bookingUserId !== socketUserId.toString()) {
        console.log('DEBUG: Returning early - Only the user can request an extension', { bookingUser: bookingUserId, socketUser: socketUserId.toString() });
        return callback({ success: false, message: 'Only the user can request an extension' });
      }

      // Check if session is active or within grace period
      const slot = booking.slot;
      const now = new Date();
      const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
      const gracePeriodMs = 60 * 1000; // 1 minute
      if (booking.status !== 'accepted' && !(now > slotEnd && now - slotEnd <= gracePeriodMs)) {
        console.log('DEBUG: Returning early - Session is not active', { bookingStatus: booking.status, now, slotEnd });
        return callback({ success: false, message: 'Session is not active' });
      }
      if (now > slotEnd && now - slotEnd <= gracePeriodMs) {
        console.log('Extension requested during grace period. now:', now, 'slotEnd:', slotEnd);
      }

      if (!slot.extensionOptions || !slot.extensionOptions[payload.extensionOptionIndex]) {
        console.log('DEBUG: Returning early - Invalid extension option', { extensionOptions: slot.extensionOptions, extensionOptionIndex: payload.extensionOptionIndex });
        return callback({ success: false, message: 'Invalid extension option' });
      }

      const extensionOptions = slot.extensionOptions.map(opt => (opt.toObject ? opt.toObject() : opt));
      const extensionOption = extensionOptions[payload.extensionOptionIndex];
      console.log('[DEBUG] After selecting extensionOption:', extensionOption, 'at index', payload.extensionOptionIndex);
      if (!extensionOption) {
        console.error('[ERROR] extensionOption is undefined or null at index', payload.extensionOptionIndex, 'options:', extensionOptions);
        return callback({ success: false, message: 'Invalid extension option selected', error: 'extensionOption is undefined or null' });
      }

      if (sessionExtensionUsed.get(payload.bookingId)) {
        return callback({ success: false, message: 'Session can only be extended once.' });
      }

      // Emit extension request to counselor
      const counselorRoom = `counselor_${booking.counselor._id}`;
      console.log('DEBUG: About to emit extensionRequested to', counselorRoom, { bookingId: payload.bookingId, extensionOption });
      io.to(counselorRoom).emit('extensionRequested', {
        bookingId: payload.bookingId,
        user: booking.user,
        extensionOption,
        currentEndTime: slotEnd.toISOString(),
        newEndTime: new Date(slotEnd.getTime() + extensionOption.duration * 60000).toISOString()
      });
      callback({ 
        success: true, 
        message: 'Extension request sent to counselor',
        extensionOption
      });
    } catch (err) {
      console.error('Error in requestExtension:', err);
      callback({ success: false, message: 'Error processing extension request' });
    }
  });

  socket.on('respondToExtension', async ({ bookingId, accepted, extensionOptionIndex }, callback) => {
    console.log('[DEBUG] respondToExtension handler entered', { bookingId, accepted, extensionOptionIndex });
    try {
      const booking = await Booking.findById(bookingId)
        .populate('slot')
        .populate('user')
        .populate('counselor');
      console.log('[DEBUG] booking after fetch:', booking);

      if (!booking) {
        console.error('[ERROR] Booking not found for bookingId:', bookingId);
        return callback({ success: false, message: 'Booking not found' });
      }

      const counselorId = booking.counselor._id ? booking.counselor._id.toString() : booking.counselor.toString();
      if (counselorId !== socket.data.userId) {
        console.error('[ERROR] Only the counselor can respond. counselorId:', counselorId, 'socket.data.userId:', socket.data.userId);
        return callback({ success: false, message: 'Only the counselor can respond to extension requests' });
      }

      const slot = booking.slot;
      const extensionOptions = slot.extensionOptions.map(opt => (opt.toObject ? opt.toObject() : opt));
      console.log('[DEBUG] extensionOptions:', extensionOptions);
      console.log('[DEBUG] extensionOptionIndex:', extensionOptionIndex);
      const extensionOption = extensionOptions[extensionOptionIndex];
      console.log('[DEBUG] extensionOption:', extensionOption);
      if (!extensionOption) {
        console.error('[ERROR] extensionOption is undefined or null at index', extensionOptionIndex, 'options:', extensionOptions);
        return callback({ success: false, message: 'Invalid extension option selected', error: 'extensionOption is undefined or null' });
      }

      if (!accepted) {
        const userRoom = `user_${booking.user._id}`;
        console.log('[DEBUG] Extension rejected, emitting extensionRejected to', userRoom);
        io.to(userRoom).emit('extensionRejected', {
          bookingId,
          message: 'Counselor rejected the extension request'
        });
        return callback({ success: true, message: 'Extension request rejected' });
      }

      const userRoom = `user_${booking.user._id}`;
      let sockets = [];
      try {
        sockets = await io.in(userRoom).allSockets();
      } catch (err) {
        console.error('[ERROR] allSockets failed:', err);
      }
      console.log('[DEBUG] About to emit extensionAccepted', { userRoom, bookingId, extensionOption, sockets: Array.from(sockets) });
      io.to(userRoom).emit('extensionAccepted', {
        bookingId,
        extensionOption,
        paymentRequired: true
      });
      callback({ 
        success: true, 
        message: 'Extension request accepted, waiting for payment',
        extensionOption
      });
    } catch (err) {
      console.error('[ERROR in respondToExtension]:', err, err?.stack);
      callback({ success: false, message: 'Error processing extension response', error: err?.message });
    }
  });

  socket.on('processExtensionPayment', async ({ bookingId, extensionOptionIndex, paymentId }, callback) => {
    console.log('processExtensionPayment handler called', { bookingId, extensionOptionIndex, paymentId, userId: socket.data.userId });
    try {
      const booking = await Booking.findById(bookingId)
        .populate('slot')
        .populate('user')
        .populate('counselor');

      if (!booking) {
        console.log('processExtensionPayment: Booking not found');
        return callback({ success: false, message: 'Booking not found' });
      }

      // Only user can process payment
      const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
      if (bookingUserId !== socket.data.userId) {
        console.log('processExtensionPayment: Only the user can process payment', { bookingUser: bookingUserId, socketUser: socket.data.userId });
        return callback({ success: false, message: 'Only the user can process payment' });
      }

      const slot = booking.slot;
      const extensionOptions = slot.extensionOptions.map(opt => (opt.toObject ? opt.toObject() : opt));
      const extensionOption = extensionOptions[extensionOptionIndex];

      // TODO: Verify payment with payment gateway
      // For now, we'll assume payment is successful
      const paymentSuccessful = true;

      if (!paymentSuccessful) {
        return callback({ success: false, message: 'Payment failed' });
      }

      // Update slot end time
      const currentEndTime = new Date(`${slot.date}T${slot.endTime}`);
      const extensionEndTime = new Date(currentEndTime.getTime() + extensionOption.duration * 60000);
      const newEndTime = extensionEndTime.toTimeString().slice(0, 5); // Format as HH:mm

      await Slot.findByIdAndUpdate(slot._id, { endTime: newEndTime });

      // Update session end time in activeSessions
      activeSessions.set(bookingId, extensionEndTime);

      // Notify both parties
      const room = `chat_${bookingId}`;
      console.log('Emitting extensionCompleted to room:', room, {
        bookingId,
        newEndTime: extensionEndTime.toISOString(),
        timeRemaining: extensionOption.duration
      });
      io.to(room).emit('extensionCompleted', {
        bookingId,
        newEndTime: extensionEndTime.toISOString(),
        timeRemaining: extensionOption.duration
      });

      sessionExtensionUsed.set(bookingId, true);

      callback({ 
        success: true, 
        message: 'Extension payment processed and time updated',
        newEndTime: extensionEndTime.toISOString(),
        timeRemaining: extensionOption.duration
      });
    } catch (err) {
      console.error('Error in processExtensionPayment:', err);
      callback({ success: false, message: 'Error processing extension payment' });
    }
  });

  // Typing indicator relay
  socket.on('typing', ({ bookingId, userId, userName }) => {
    const room = `chat_${bookingId}`;
    socket.to(room).emit('typing', { userId, userName });
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