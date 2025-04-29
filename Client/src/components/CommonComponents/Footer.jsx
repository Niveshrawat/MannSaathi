import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        py: 3,
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#4285f4',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontSize: '1rem' }}>
              मन्न्
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ color: '#333', fontWeight: 600, mr: 2 }}
            >
              Mann Saathi
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              About
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Privacy
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Terms
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Contact
            </Typography>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            © 2025 Mann Saathi. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            In case of emergency, please call India's Mental Health Helpline: KIRAN 1800-599-0019
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;