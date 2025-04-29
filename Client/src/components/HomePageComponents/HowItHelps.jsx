import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShieldIcon from '@mui/icons-material/Shield';
import TranslateIcon from '@mui/icons-material/Translate';

const features = [
  {
    icon: <MenuBookIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'AI–Guided Support',
    description:
      'Get immediate assistance from our AI companion trained in evidence-based techniques like CBT and mindfulness.',
  },
  {
    icon: <FavoriteIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Human Connection',
    description:
      'Connect with trained professionals and volunteer listeners for personalized support when you need it most.',
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Privacy First',
    description:
      'Your mental health journey is personal. Use anonymously or create a secure account with full data protection.',
  },
  {
    icon: <TranslateIcon sx={{ fontSize: 40, color: '#a691f1' }} />,
    title: 'Culturally Sensitive',
    description:
      'Content and support tailored to Indian contexts, available in multiple regional languages.',
  },
];

const HowItHelps = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box component="section" py={{ xs: 8, md: 12 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6} px={{ xs: 2, md: 0 }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            How Mann Saathi Helps
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Our platform combines technology with human compassion to create a supportive space for your mental health needs.
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="stretch"
          flexWrap="wrap"
        >
          {features.map(({ icon, title, description }) => (
            <Box
              key={title}
              flex="1"
              mx={1}
              mb={{ xs: 3, md: 0 }} // Bottom spacing for small devices
              minWidth={isMdUp ? 0 : '200px'}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box mb={2}>{icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItHelps;
