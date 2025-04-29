import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const WaitingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Connecting to a counselor...
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Please wait while we connect you with an available counselor.
        This may take a few moments.
      </Typography>
    </Box>
  );
};

export default WaitingScreen; 