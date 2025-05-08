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
import { getSessionByBookingId } from '../../services/api';

const SessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const bookingId = new URLSearchParams(location.search).get('id');
    if (!bookingId) {
      setLoading(false);
      setSessionData(null);
      return;
    }
    setLoading(true);
    getSessionByBookingId(bookingId)
      .then((session) => {
        setSessionData(session);
      })
      .catch(() => {
        setSessionData(null);
      })
      .finally(() => {
        setLoading(false);
      });
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