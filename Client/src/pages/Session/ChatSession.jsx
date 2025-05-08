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
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
} from '@mui/icons-material';
import io from 'socket.io-client';

const ChatSession = ({ sessionData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);
  const socketRef = React.useRef(null);
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userObj._id?.toString();
  const counselorId = sessionData.counselor?._id?.toString() || sessionData.counselor?.toString();
  const userIdFromSession = sessionData.user?._id?.toString() || sessionData.user?.toString();

  const isCurrentUserCounselor = userId && counselorId && userId === counselorId;
  const chatName = isCurrentUserCounselor ? sessionData.user.name : sessionData.counselor.name;
  const chatAvatar = isCurrentUserCounselor ? sessionData.user.profilePicture : sessionData.counselor.profilePicture;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!sessionData?.booking) return;
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    socket.emit('joinRoom', { token, bookingId: sessionData.booking }, (res) => {
      if (res.success) {
        // Joined successfully
      }
    });
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.disconnect();
    };
  }, [sessionData?.booking, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.emit('chatMessage', {
        bookingId: sessionData.booking,
        message: newMessage
      });
      setNewMessage("");
    }
  };

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
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={formatTime(sessionTime)}
            color="primary"
            variant="outlined"
          />
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
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatSession; 