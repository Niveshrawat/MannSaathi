import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const BookingForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    language: '',
    mood: '',
    preferredGender: '',
    issues: '',
    availability: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Form submitted:', formData);
    onComplete();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Book a Counseling Session
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please provide some information to help us match you with the right counselor.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <FormControl fullWidth>
              <InputLabel>Preferred Language</InputLabel>
              <Select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="spanish">Spanish</MenuItem>
                <MenuItem value="french">French</MenuItem>
                <MenuItem value="hindi">Hindi</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <FormControl fullWidth>
              <InputLabel>Current Mood</InputLabel>
              <Select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                required
              >
                <MenuItem value="anxious">Anxious</MenuItem>
                <MenuItem value="depressed">Depressed</MenuItem>
                <MenuItem value="stressed">Stressed</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
                <MenuItem value="happy">Happy</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <FormControl fullWidth>
              <InputLabel>Preferred Counselor Gender</InputLabel>
              <Select
                name="preferredGender"
                value={formData.preferredGender}
                onChange={handleChange}
                required
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <FormControl fullWidth>
              <InputLabel>Preferred Time</InputLabel>
              <Select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <MenuItem value="morning">Morning (9AM - 12PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (12PM - 5PM)</MenuItem>
                <MenuItem value="evening">Evening (5PM - 9PM)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Brief description of your issues"
              name="issues"
              value={formData.issues}
              onChange={handleChange}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Find Matching Counselors
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookingForm; 