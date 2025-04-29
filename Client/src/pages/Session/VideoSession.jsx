import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  Divider,
  TextField,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  MoreVert,
  Send,
  AttachFile,
  InsertEmoticon,
  Timer,
  Close,
  Chat,
  People,
  Settings,
  ArrowBack,
  Psychology,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/CommonComponents/Navbar';

const VideoSession = ({ sessionData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: sessionData.counselor.name,
      message: "Hello! How are you feeling today?",
      timestamp: '10:00 AM',
      isCounselor: true,
    },
    {
      id: 2,
      sender: 'You',
      message: "I'm feeling a bit anxious today.",
      timestamp: '10:01 AM',
      isCounselor: false,
    },
  ]);
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: sessionData.counselor.name,
      role: 'Counselor',
      isSpeaking: true,
      isMuted: false,
      isVideoOn: true,
    },
    {
      id: 2,
      name: 'You',
      role: 'Client',
      isSpeaking: false,
      isMuted: false,
      isVideoOn: true,
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    // Simulate loading session data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCounselor: false,
        },
      ]);
      setMessage('');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEndSession = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#f5f5f5'
      }}>
        <Navbar />
        <Box sx={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}>
          <Box sx={{ 
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: 400,
            width: '100%'
          }}>
            <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>
              Joining video session...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we connect you to your counselor
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!sessionData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              borderRadius: 2,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Psychology sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Video Session Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              The video session you're trying to join doesn't exist or you don't have permission to access it.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Return to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={sessionData.counselor.image}
            alt={sessionData.counselor.name}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {sessionData.counselor.name}
            </Typography>
            <Typography variant="body2">
              {sessionData.counselor.specialization}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {formatTime(sessionTime)}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Video Area */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            p: 2,
            gap: 2
          }}
        >
          {/* Main Video */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.900',
              position: 'relative'
            }}
          >
            <Avatar
              src={sessionData.counselor.image}
              alt={sessionData.counselor.name}
              sx={{ width: 120, height: 120 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            >
              {sessionData.counselor.name}
            </Typography>
          </Paper>

          {/* Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              py: 2
            }}
          >
            <IconButton
              color={isMuted ? 'error' : 'primary'}
              onClick={() => setIsMuted(!isMuted)}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton
              color={isVideoOff ? 'error' : 'primary'}
              onClick={() => setIsVideoOff(!isVideoOff)}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              {isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
            <IconButton
              color={isScreenSharing ? 'error' : 'primary'}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
            </IconButton>
          </Box>
        </Box>

        {/* Chat Area */}
        {isChatOpen && (
          <Box
            sx={{
              width: 300,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Chat
              </Typography>
            </Box>
            <List
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2
              }}
            >
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.isCounselor ? 'flex-start' : 'flex-end',
                    px: 0
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: message.isCounselor ? 'primary.light' : 'primary.main',
                      color: 'white',
                      p: 1,
                      borderRadius: 2,
                      mb: 0.5
                    }}
                  >
                    <Typography variant="body2">
                      {message.message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {message.timestamp}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 1
                }}
              >
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <IconButton size="small">
                  <InsertEmoticon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? 'Hide Chat' : 'Show Chat'}
        </MenuItem>
        <MenuItem onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}>
          {isParticipantsOpen ? 'Hide Participants' : 'Show Participants'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleEndSession}>End Session</MenuItem>
      </Menu>
    </Box>
  );
};

export default VideoSession; 