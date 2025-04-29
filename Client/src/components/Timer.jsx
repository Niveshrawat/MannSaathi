import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const Timer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={(timeLeft / duration) * 100} 
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
};

export default Timer; 