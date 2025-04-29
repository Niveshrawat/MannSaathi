import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Timer = ({ initialTime, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccessTimeIcon color="primary" />
      <Typography variant="body2" color="text.secondary">
        {`${minutes}:${seconds.toString().padStart(2, '0')}`}
      </Typography>
    </Box>
  );
};

export default Timer; 