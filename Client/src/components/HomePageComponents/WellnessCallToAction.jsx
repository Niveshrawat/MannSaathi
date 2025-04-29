import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const WellnessCallToAction = () => {
  return (
    <Box sx={{ py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'linear-gradient(90deg,rgb(179, 164, 248) 0%,rgb(71, 204, 244) 100%)',
            borderRadius: 2,
            textAlign: 'center',
            color: '#fff',
            py: 4,
            mx: 'auto',
            maxWidth: '100%',
            width: { xs: '100%', md: '100%' }, // Constrain width for symmetry
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Begin Your Wellness Journey Today
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, color: '#e0e0ff' }}
          >
            Take the first step towards better mental health with Manas Sathi's supportive community and tools.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#d1c4e9',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#b39ddb' },
              }}
            >
              Start Now
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#4fc3f7',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#29b6f6' },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WellnessCallToAction;