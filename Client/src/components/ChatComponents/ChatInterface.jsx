import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Button,
  Avatar,
  InputAdornment,
  Fade
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import io from 'socket.io-client';

const ChatInterface = ({ chatMode, onSwitchToHuman, bookingId, token }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!bookingId || !token) return;
    const newSocket = io('http://localhost:5000'); // Update if backend URL is different
    setSocket(newSocket);
    newSocket.emit('joinRoom', { token, bookingId }, (res) => {
      if (res.success) {
        setConnected(true);
        setError('');
      } else {
        setConnected(false);
        setError(res.message || 'Unable to join chat');
      }
    });
    newSocket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      newSocket.disconnect();
    };
  }, [bookingId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !connected) return;
    const msgObj = {
      bookingId,
      message
    };
    socket.emit('chatMessage', msgObj);
    setMessages((prev) => [
      ...prev,
      {
        userId: 'me',
        message,
        timestamp: new Date().toISOString()
      }
    ]);
    setMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: '#F8F9FE'
    }}>
      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#666',
          },
        },
      }}>
        {messages.map((msg, index) => (
          <Fade in={true} key={msg.id} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {msg.sender === 'counselor' && (
                <Avatar
                  src="/manas-ai-avatar.png"
                  alt="Manas AI"
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: 'primary.main',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  M
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: msg.sender === 'user' ? 'primary.main' : '#FFFFFF',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  '&::before': msg.sender === 'counselor' ? {
                    content: '""',
                    position: 'absolute',
                    left: -8,
                    bottom: 8,
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '8px 8px 0 0',
                    borderColor: 'transparent #FFFFFF transparent transparent',
                  } : {}
                }}
              >
                {msg.sender === 'counselor' && (
                  <Typography 
                    variant="subtitle2" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Manas AI
                  </Typography>
                )}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    letterSpacing: 0.2
                  }}
                >
                  {msg.text}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    display: 'block',
                    mt: 0.5,
                    textAlign: 'right'
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        {chatMode === 'ai' && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onSwitchToHuman}
            sx={{ 
              mb: 2, 
              borderRadius: 5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            Talk to Human →
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 5,
                backgroundColor: '#F8F9FE',
                '&:hover': {
                  backgroundColor: '#F0F2FE'
                },
                '& fieldset': {
                  borderColor: 'transparent'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    <MicNoneOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <IconButton 
            color="primary"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground'
              }
            }}
          >
            <SendOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface; 