// src/pages/ChatPage.jsx
import React from 'react';
import { Box, Container, Typography, Paper, TextField, IconButton, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const ChatPage = () => {
  return (
    <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Chat Support
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Talk with our AI or schedule time with a human support provider
        </Typography>

        {/* Main flex container replacing Grid */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}
        >
          {/* Left Chat Column */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Paper elevation={0} sx={{ backgroundColor: '#F3F1FF', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Chat with Manas AI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share how you’re feeling or ask for support
              </Typography>
            </Paper>

            {/* Chat Window */}
            <Paper elevation={1} sx={{ flex: 1, overflowY: 'auto', p: 2, borderRadius: 1 }}>
              {/* Example message */}
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  backgroundColor: '#FFFFFF',
                  p: 1.5,
                  borderRadius: 1,
                  mb: 2
                }}
              >
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#A691F1', mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Manas AI
                  </Typography>
                  <Typography variant="body2">
                    Hello! I’m Manas Saathi, your mental wellness companion. How are you feeling today?
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                  12:34 PM
                </Typography>
              </Paper>
              {/* Additional messages will go here */}
            </Paper>

            {/* Input Box */}
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                border: '1px solid #E0E0E0',
                p: 0.5
              }}
            >
              <Button variant="text" sx={{ flexShrink: 0, textTransform: 'none' }}>
                Talk to Human →
              </Button>
              <TextField
                placeholder="Type your message..."
                variant="standard"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{ ml: 1 }}
              />
              <IconButton sx={{ color: 'text.secondary' }}>
                <MicNoneOutlinedIcon />
              </IconButton>
              <IconButton color="primary">
                <SendOutlinedIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Right Sidebar */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Schedule Human Support Card */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarMonthIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Schedule Human Support
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Connect with trained volunteers or professionals
              </Typography>
              <Button variant="contained" fullWidth sx={{ textTransform: 'none' }}>
                Book a Session
              </Button>
            </Paper>

            {/* About Manas AI Card */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoOutlinedIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  About Manas AI
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Manas AI is designed to provide immediate support using evidence-based
                techniques like CBT, mindfulness, and active listening. While helpful,
                it's not a replacement for professional mental health care.
              </Typography>
              <Paper elevation={0} sx={{ p: 1, backgroundColor: '#FFF9C4', borderRadius: 1 }}>
                <Typography variant="caption" color="text.primary">
                  Privacy Note: Your conversations are private and used only to improve your experience.
                </Typography>
              </Paper>
            </Paper>

            {/* Crisis Support Card */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 1, backgroundColor: '#FFEBEE' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReportProblemOutlinedIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="error">
                  Crisis Support
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                If you're experiencing a mental health emergency or having thoughts of harming yourself:
              </Typography>
              <Typography variant="body2">
                • Call KIRAN Mental Health Helpline: <strong>1800-599-0019</strong> (24/7)
              </Typography>
              <Typography variant="body2" mb={2}>
                • Emergency Medical Services: <strong>102/108</strong>
              </Typography>
              <Button variant="contained" color="error" fullWidth sx={{ textTransform: 'none' }}>
                Access Crisis Resources
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ChatPage;
