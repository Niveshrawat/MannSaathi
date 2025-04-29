import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Mock data for counselors - in a real app, this would come from your backend
const mockCounselors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Depression',
    experience: '8 years',
    rating: 4.8,
    price: 75,
    languages: ['English', 'Spanish'],
    availability: 'Morning',
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Stress Management',
    experience: '12 years',
    rating: 4.9,
    price: 85,
    languages: ['English', 'Chinese'],
    availability: 'Afternoon',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Dr. Priya Patel',
    specialization: 'Relationship Counseling',
    experience: '6 years',
    rating: 4.7,
    price: 70,
    languages: ['English', 'Hindi'],
    availability: 'Evening',
    image: 'https://i.pravatar.cc/150?img=3',
  },
];

const CounselorSelection = ({ onBookingComplete }) => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleBookSession = (counselor) => {
    setSelectedCounselor(counselor);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentDialog(false);
    onBookingComplete();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Available Counselors
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Select a counselor based on your preferences and requirements.
      </Typography>

      <Grid container spacing={3}>
        {mockCounselors.map((counselor) => (
          <Grid item xs={12} md={4} key={counselor.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={counselor.image}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{counselor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {counselor.specialization}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Rating value={counselor.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {counselor.experience} of experience
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {counselor.languages.map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="h6" color="primary">
                  ${counselor.price}/session
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleBookSession(counselor)}
                >
                  Book Session
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <DialogTitle>Complete Your Booking</DialogTitle>
        <DialogContent>
          {selectedCounselor && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCounselor.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Session Price: ${selectedCounselor.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You will be redirected to our secure payment gateway to complete your booking.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePaymentComplete}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CounselorSelection; 