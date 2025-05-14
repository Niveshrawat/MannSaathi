import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Divider,
  Button,
  Chip,
  Modal,
  Rating,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
} from '@mui/icons-material';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const ChatSession = ({ sessionData }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const socketRef = React.useRef(null);
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userObj._id?.toString();
  const counselorId = sessionData.counselor?._id?.toString() || sessionData.counselor?.toString();
  const userIdFromSession = sessionData.user?._id?.toString() || sessionData.user?.toString();

  const isCurrentUserCounselor = userId && counselorId && userId === counselorId;
  const chatName = isCurrentUserCounselor ? sessionData.user.name : sessionData.counselor.name;
  const chatAvatar = isCurrentUserCounselor ? sessionData.user.profilePicture : sessionData.counselor.profilePicture;
  const token = localStorage.getItem('token');
  const isUser = userId === userIdFromSession;

  useEffect(() => {
    if (!sessionData?.booking) return;
    // Only create the socket once
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000');
    }
    const socket = socketRef.current;
    socket.emit('joinRoom', { token, bookingId: sessionData.booking }, (res) => {
      if (res.success) {
        setTimeRemaining(res.timeRemaining);
        if (res.sessionEndTimestamp) setSessionEndTime(res.sessionEndTimestamp);
      }
    });
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('timeRemaining', ({ minutesRemaining }) => {
      setTimeRemaining(minutesRemaining);
    });
    socket.on('sessionEnded', ({ message, endedByUser }) => {
      setSessionEnded(true);
      setTimeRemaining(0);
      toast(message);
      console.log('sessionEnded called, isUser:', isUser);
      if (isUser) {
        setShowFeedback(true);
        console.log('setShowFeedback(true) called');
      }
    });
    socket.on('error', ({ message }) => {
      toast.error(message);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionData?.booking, token]);

  // Per-second countdown
  useEffect(() => {
    if (!sessionEndTime) return;
    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((sessionEndTime - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
        // Play sound when time is up
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio play failed:', err));
        // Show toast notification
        toast.info('Session time has ended', {
          icon: '⏰',
          duration: 5000
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionEndTime]);

  // Update: use timeLeft for display
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (seconds) => {
    if (seconds < 60) return 'error'; // Red for less than 1 minute
    if (seconds < 300) return 'warning'; // Orange for less than 5 minutes
    return 'primary'; // Default blue
  };

  const handleSendMessage = () => {
    if (message.trim() && !sessionEnded) {
      socketRef.current.emit('chatMessage', {
        bookingId: sessionData.booking,
        message: message
      });
      setMessage('');
    }
  };

  useEffect(() => {
    if (!sessionData?.booking) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${sessionData.booking}`);
        if (!res.ok) return;
        const booking = await res.json();
        if (booking.status === 'completed') {
          setSessionEnded(true);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          clearInterval(interval);
    }
      } catch (err) {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionData?.booking]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={chatAvatar}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">{chatName}</Typography>
            {timeLeft !== null && (
              <Typography variant="caption" color="text.secondary">
                {sessionEnded ? 'Session ended' : `Time remaining: ${Math.ceil(timeLeft / 60)} minutes`}
            </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={
              timeLeft !== null && timeLeft !== undefined && !isNaN(timeLeft)
                ? formatTime(timeLeft)
                : (timeRemaining !== null && timeRemaining !== undefined && !isNaN(timeRemaining)
                    ? formatTime(timeRemaining * 60)
                    : '--:--')
            }
            color={timeLeft ? getTimerColor(timeLeft) : 'primary'}
            variant="outlined"
          />
          {!sessionEnded && isUser && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowFinishModal(true)}
            >
              Finish Session
            </Button>
          )}
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: 'grey.50',
          p: 2
        }}
      >
        <List>
          {messages.map((msg, index) => {
            const isMe = msg.sender === userId;
            return (
            <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  mb: 1
                }}
                >
                <Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: isMe ? 'primary.main' : 'grey.100',
                      color: isMe ? 'white' : 'text.primary',
                      borderRadius: 2,
                      maxWidth: 350,
                      minWidth: 60,
                      textAlign: isMe ? 'right' : 'left'
                    }}
                  >
                    <Typography>
                      {msg.message || msg.text || msg.content || '[No message]'}
                    </Typography>
                  </Paper>
                  <Typography variant="caption" color="text.secondary">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </Typography>
              </Box>
            </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Message Input */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton>
          <EmojiEmotions />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>
        <TextField
          fullWidth
          placeholder={sessionEnded ? "Session has ended" : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          variant="outlined"
          size="small"
          disabled={sessionEnded}
        />
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSendMessage}
          disabled={sessionEnded || !message.trim()}
        >
          Send
        </Button>
      </Paper>
      {/* Finish Session Confirmation Modal */}
      <Modal open={showFinishModal} onClose={() => setShowFinishModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            End Session?
          </Typography>
          <Typography gutterBottom>
            Are you sure you want to end this session for both participants?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.log('Socket ID:', socketRef.current && socketRef.current.id);
              console.log('Emitting finishSession with bookingId:', sessionData.booking);
              socketRef.current.emit('finishSession', { bookingId: sessionData.booking });
              setShowFinishModal(false);
            }}
            sx={{ mt: 2 }}
          >
            Yes, End Session
          </Button>
          <Button onClick={() => setShowFinishModal(false)} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal open={sessionEnded} onClose={() => {}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Session Completed
          </Typography>
          <Typography variant="body1" gutterBottom>
            {isUser ? 'Your session has ended. Thank you!' : 'Session was ended by the user.'}
          </Typography>
          {isUser && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = '/dashboard'}
              sx={{ mt: 2 }}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Modal>
      <Modal open={showFeedback} onClose={() => {}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 320,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Rate Your Session
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            label="Leave a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={rating === 0 || feedbackSubmitted}
            onClick={async () => {
              setFeedbackSubmitted(true);
              try {
                const response = await fetch(`http://localhost:5000/api/bookings/${sessionData.booking}/feedback`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ rating, comment })
                });
                const data = await response.json();
                console.log('Feedback API response:', data);
                if (!response.ok) {
                  toast.error(data.message || 'Failed to submit feedback');
                  setFeedbackSubmitted(false);
                  return;
                }
                setShowFeedback(false);
                toast.success('Thank you for your feedback!');
              } catch (err) {
                toast.error('Network error submitting feedback');
                setFeedbackSubmitted(false);
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatSession; 