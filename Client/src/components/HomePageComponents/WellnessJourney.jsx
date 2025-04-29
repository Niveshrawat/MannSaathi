import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';

const features = [
  {
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'AI Chat Support',
    description:
      'Connect with our AI companion for immediate support, guided exercises, and a listening ear whenever you need it.',
    buttonText: 'Start Chatting',
    gradient: 'linear-gradient(135deg, rgba(243,232,255,0.8) 0%, rgba(232,246,255,0.8) 100%)',
  },
  {
    icon: <EditIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Private Journal',
    description:
      'Express your thoughts and feelings in a secure, private journal with optional AI insights to help track your mental wellness.',
    buttonText: 'Write Journal',
    gradient: 'linear-gradient(135deg, rgba(243,232,255,0.8) 0%, rgba(232,255,232,0.8) 100%)',
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Resource Library',
    description:
      'Access articles, videos, and activities curated by mental health professionals in multiple Indian languages.',
    buttonText: 'Explore Resources',
    gradient: 'linear-gradient(135deg, rgba(243,232,255,0.8) 0%, rgba(255,250,232,0.8) 100%)',
  },
  {
    icon: <FavoriteIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Human Support',
    description:
      'Connect with trained volunteers and professionals for more personalized guidance and support.',
    buttonText: 'Connect with Humans',
    gradient: 'linear-gradient(135deg, rgba(243,232,255,0.8) 0%, rgba(255,232,250,0.8) 100%)',
  },
];

const WellnessJourney = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        mb: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6} px={{ xs: 2, md: 0 }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            Your Mental Wellness Journey
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explore the tools and resources available to support your mental health.
          </Typography>
        </Box>

        {/* Grid Layout */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={4}
        >
          {features.map((item, index) => (
            <Grow key={item.title} in timeout={600 + index * 200}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: item.gradient,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box mb={2}>{item.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                  {item.description}
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#a691f1',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#8e7bdc' },
                  }}
                >
                  {item.buttonText}
                </Button>
              </Paper>
            </Grow>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WellnessJourney;
