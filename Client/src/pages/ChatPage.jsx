import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  CalendarMonth as CalendarMonthIcon,
  InfoOutlined as InfoOutlinedIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
  MicNoneOutlined as MicNoneOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/CommonComponents/Navbar';
import ChatInterface from '../components/ChatComponents/ChatInterface';
import Timer from '../components/ChatComponents/Timer';
import WaitingScreen from '../components/ChatComponents/WaitingScreen';
import SessionExpiredDialog from '../components/ChatComponents/SessionExpiredDialog';

const ChatPage = () => {
  const navigate = useNavigate();
  const [chatMode, setChatMode] = useState('ai'); // 'ai' or 'human'
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);
  const [sessionTime, setSessionTime] = useState(20); // 60 seconds for trial

  const handleSwitchToHuman = () => {
    setShowWaitingScreen(true);
    // Simulate connecting to a counselor after 2 seconds
    setTimeout(() => {
      setShowWaitingScreen(false);
      setChatMode('human');
    }, 2000);
  };

  const handleSessionExpired = () => {
    setShowSessionExpiredDialog(true);
  };

  const handleBookSession = () => {
    navigate('/book-session');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#FAFAFA'
    }}>
      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Chat Support
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Talk with our AI or schedule time with a human support provider
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flexGrow: 1,
          minHeight: 0 // Important for proper flex behavior
        }}>
          {/* Main Chat Area */}
          <Box sx={{ 
            flex: { md: '0 0 66.666667%' },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            minHeight: { xs: '500px', md: '0' } // Fixed height on mobile, flexible on desktop
          }}>
            {/* Chat Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: 1, 
              borderColor: 'divider',
              background: 'linear-gradient(45deg, #F8F9FE 30%, #F3F1FF 90%)'
            }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Chat with Manas AI
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Share how you're feeling or ask for support
              </Typography>
              {chatMode === 'human' && (
                <Box sx={{ mt: 2 }}>
                  <Timer 
                    initialTime={sessionTime} 
                    onExpired={handleSessionExpired}
                  />
                </Box>
              )}
            </Box>

            {/* Chat Window */}
            <Box sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0 // Important for proper scrolling
            }}>
              {showWaitingScreen ? (
                <WaitingScreen />
              ) : (
                <ChatInterface 
                  chatMode={chatMode}
                  onSwitchToHuman={handleSwitchToHuman}
                />
              )}
            </Box>
          </Box>

          {/* Info Sections Sidebar */}
          <Box sx={{ 
            flex: { md: '0 0 33.333333%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {/* Chat Support Info */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: '#F3F1FF',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Chat Support</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Our AI counselor is available 24/7 to provide support and guidance.
              </Typography>
            </Paper>

            {/* Emergency Resources */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: '#FFF3E0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReportProblemOutlinedIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Emergency Resources</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                If you're experiencing a mental health emergency, please contact emergency services immediately.
              </Typography>
            </Paper>

            {/* Schedule Session */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: '#E3F2FD',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Schedule a Session</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Book a session with one of our professional counselors.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleBookSession}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0px 4px 12px rgba(33, 150, 243, 0.2)',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(33, 150, 243, 0.3)'
                  }
                }}
              >
                Book Now
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Session Expired Dialog */}
      <SessionExpiredDialog 
        open={showSessionExpiredDialog}
        onClose={() => setShowSessionExpiredDialog(false)}
        onBookSession={handleBookSession}
      />
    </Box>
  );
};

export default ChatPage; 