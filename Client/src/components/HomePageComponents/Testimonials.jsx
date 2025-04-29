import React from 'react';
import { Typography, Paper, Box, Container, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const testimonials = [
  {
    stars: 5,
    text: "“Manas Sathi helped me understand my anxiety during exam season. The simple breathing exercises made a huge difference.”",
    name: "Priya S.",
    location: "Delhi",
  },
  {
    stars: 4,
    text: "“Being able to journal my thoughts privately and get gentle feedback helped me process my feelings during a difficult time.”",
    name: "Rahul M.",
    location: "Bangalore",
  },
  {
    stars: 5,
    text: "“The resources in my native language helped me explain mental health concepts to my parents. This bridge was invaluable.”",
    name: "Ananya K.",
    location: "Chennai",
  },
];

const Testimonials = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: "#e5ddff", py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#333", mb: 2 }}
        >
          Stories of Support
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          sx={{ mb: 5, color: "#666" }}
        >
          Hear from people who found help and hope through Manas Sathi.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {testimonials.map((t, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                flex: 1,
                maxWidth: { xs: "100%", md: "30%" },
                backgroundColor: "#fff",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                {[...Array(t.stars)].map((_, i) => (
                  <StarIcon
                    key={i}
                    fontSize="small"
                    sx={{ color: "#fbc02d", mr: 0.5 }}
                  />
                ))}
              </Box>
              <Typography
                variant="body1"
                sx={{ fontStyle: "italic", mb: 2, color: "#444" }}
              >
                {t.text}
              </Typography>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#333" }}>
                  {t.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ color: "#666" }}>
                  {t.location}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;