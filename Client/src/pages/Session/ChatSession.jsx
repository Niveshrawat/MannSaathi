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

const ChatSession = ({ sessionData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Dr. Sarah Johnson",
      message: "Hello! How are you feeling today?",
      timestamp: new Date().toISOString(),
      isCounselor: true
    },
    {
      id: 2,
      sender: "You",
      message: "I'm feeling a bit anxious today.",
      timestamp: new Date().toISOString(),
      isCounselor: false
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);

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
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "You",
        message: newMessage,
        timestamp: new Date().toISOString(),
        isCounselor: false
      }]);
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
            src="https://randomuser.me/api/portraits/women/1.jpg"
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">Dr. Sarah Johnson</Typography>
            <Typography variant="body2" color="text.secondary">
              Anxiety & Depression Specialist
            </Typography>
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
          {messages.map((msg, index) => (
            <ListItem
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isCounselor ? 'flex-start' : 'flex-end',
                gap: 0.5,
                mb: 2
              }}
            >
              {(index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()) && (
                <Chip
                  label={new Date(msg.timestamp).toLocaleDateString()}
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  flexDirection: msg.isCounselor ? 'row' : 'row-reverse'
                }}
              >
                <Avatar
                  src={msg.isCounselor ? "https://randomuser.me/api/portraits/women/1.jpg" : undefined}
                  sx={{ width: 32, height: 32 }}
                >
                  {!msg.isCounselor && "Y"}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {msg.sender}
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: msg.isCounselor ? 'grey.100' : 'primary.main',
                      color: msg.isCounselor ? 'text.primary' : 'white',
                      borderRadius: 2,
                      maxWidth: '80%'
                    }}
                  >
                    <Typography>{msg.message}</Typography>
                  </Paper>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
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