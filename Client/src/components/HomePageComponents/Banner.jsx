import React from 'react';
import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import { green, orange, yellow } from '@mui/material/colors';
import BannerImage from '/images/banner.png'; // update path as needed

const Banner = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 16 },
        background: 'linear-gradient(135deg, #f7f7ff 0%, #eef5fd 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Side */}
          <Box flex="1" pr={{ md: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              Your companion for <br />
              mental well-being
            </Typography>
            <Typography
              variant="body1"
              mb={4}
              sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              Mann Saathi offers compassionate support for your mental health journey,
              through AI assistance and human connection, tailored for Indian contexts.
            </Typography>

            {/* Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#a691f1',
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: '#8e7bdc' },
                }}
              >
                Start Talking Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#a691f1',
                  color: 'text.primary',
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: 'rgba(166,145,241,0.1)' },
                }}
              >
                Explore Resources
              </Button>
            </Stack>

            {/* Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label="✓ Private"
                size="small"
                sx={{ bgcolor: green[100], color: green[800] }}
              />
              <Chip
                label="✓ Supportive"
                size="small"
                sx={{ bgcolor: orange[100], color: orange[800] }}
              />
              <Chip
                label="✓ Accessible"
                size="small"
                sx={{ bgcolor: yellow[100], color: yellow[800] }}
              />
            </Stack>
          </Box>

          {/* Right Side Image */}
          <Box
            flex="1"
            mt={{ xs: 6, md: 0 }}
            display="flex"
            justifyContent={{ xs: 'center', md: 'flex-end' }}
          >
            <Box
              component="img"
              src={BannerImage}
              alt="Chat Interface"
              sx={{
                maxWidth: { xs: '100%', md: 600 },
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
