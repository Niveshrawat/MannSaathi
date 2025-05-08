const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Booking = require('./models/Booking');
const Slot = require('./models/Slot');
const Session = require('./models/Session');

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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Authenticate user via JWT sent in query
  socket.on('joinRoom', async ({ token, bookingId }, callback) => {
    try {
      if (!token || !bookingId) return callback({ success: false, message: 'Missing token or bookingId' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      // Find booking and slot
      const booking = await Booking.findById(bookingId).populate('slot');
      if (!booking || booking.status !== 'accepted' || booking.type !== 'chat') {
        return callback({ success: false, message: 'Invalid or inactive chat booking' });
      }
      // Only user or counselor can join
      if (booking.user.toString() !== userId && booking.counselor.toString() !== userId) {
        return callback({ success: false, message: 'Not authorized for this chat' });
      }
      // Check if current time is within slot time
      const now = new Date();
      const slotDate = booking.slot.date;
      const start = new Date(`${slotDate}T${booking.slot.startTime}`);
      const end = new Date(`${slotDate}T${booking.slot.endTime}`);
      if (now < start || now > end) {
        return callback({ success: false, message: 'Chat only available during slot time' });
      }
      // Join room
      const room = `chat_${bookingId}`;
      socket.join(room);
      socket.data.userId = userId;
      socket.data.bookingId = bookingId;
      // Send chat history
      const session = await Session.findOne({ booking: bookingId });
      if (session && session.messages) {
        socket.emit('chatHistory', session.messages);
      }
      callback({ success: true, message: 'Joined chat room', room });
    } catch (err) {
      callback({ success: false, message: 'Auth or join error' });
    }
  });

  // Handle chat messages
  socket.on('chatMessage', async ({ bookingId, message }) => {
    const room = `chat_${bookingId}`;
    if (!socket.data.bookingId || socket.data.bookingId !== bookingId) return;
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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { io }; 