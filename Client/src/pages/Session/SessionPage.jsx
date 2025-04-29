import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import VideoSession from './VideoSession';
import ChatSession from './ChatSession';

const SessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('id');
    
    // Simulate loading
    setTimeout(() => {
      // Mock session data based on the session ID
      const mockSessions = {
        3: {
          id: 3,
          type: 'video',
          counselor: {
            name: "Dr. Sarah Johnson",
            specialization: "Anxiety & Depression",
            rating: 4.8,
            image: "https://randomuser.me/api/portraits/women/1.jpg"
          },
          date: "2024-03-20",
          time: "10:00 AM",
          duration: 60
        },
        4: {
          id: 4,
          type: 'chat',
          counselor: {
            name: "Dr. Michael Chen",
            specialization: "Stress Management",
            rating: 4.9,
            image: "https://randomuser.me/api/portraits/men/2.jpg"
          },
          date: "2024-03-22",
          time: "2:30 PM",
          duration: 45
        },
        5: {
          id: 5,
          type: 'video',
          counselor: {
            name: "Dr. Emily Brown",
            specialization: "Relationship Counseling",
            rating: 4.7,
            image: "https://randomuser.me/api/portraits/women/3.jpg"
          },
          date: "2024-03-25",
          time: "11:00 AM",
          duration: 60
        }
      };
      
      const session = mockSessions[sessionId];
      if (session) {
        setSessionData(session);
      }
      setLoading(false);
    }, 1000);
  }, [location]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Joining session...
        </Typography>
      </Box>
    );
  }

  if (!sessionData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 3,
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Session Not Found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 3,
            py: 1
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {sessionData.type === 'video' ? (
        <VideoSession sessionData={sessionData} />
      ) : (
        <ChatSession sessionData={sessionData} />
      )}
    </Box>
  );
};

export default SessionPage; 