import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import Navbar from '../components/CommonComponents/Navbar';

// Mock data for counselors - in a real app, this would come from your backend
const mockCounselors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Depression',
    experience: '8 years',
    rating: 4.8,
    prices: {
      video: 75,
      chat: 50
    },
    languages: ['English', 'Spanish'],
    availability: 'Morning',
    image: 'https://i.pravatar.cc/150?img=1',
    bio: 'Dr. Johnson specializes in treating anxiety and depression using evidence-based approaches including CBT and mindfulness techniques.',
    education: 'Ph.D. in Clinical Psychology, Stanford University',
    certifications: ['Licensed Clinical Psychologist', 'CBT Certified', 'Mindfulness Instructor']
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Stress Management',
    experience: '12 years',
    rating: 4.9,
    prices: {
      video: 85,
      chat: 60
    },
    languages: ['English', 'Chinese'],
    availability: 'Afternoon',
    image: 'https://i.pravatar.cc/150?img=2',
    bio: 'Dr. Chen has extensive experience in helping clients manage stress and develop resilience through practical techniques and lifestyle changes.',
    education: 'Ph.D. in Counseling Psychology, Columbia University',
    certifications: ['Licensed Professional Counselor', 'Stress Management Specialist', 'Executive Coach']
  },
  {
    id: 3,
    name: 'Dr. Priya Patel',
    specialization: 'Relationship Counseling',
    experience: '6 years',
    rating: 4.7,
    prices: {
      video: 70,
      chat: 45
    },
    languages: ['English', 'Hindi'],
    availability: 'Evening',
    image: 'https://i.pravatar.cc/150?img=3',
    bio: 'Dr. Patel focuses on helping individuals and couples improve their relationships through effective communication and understanding.',
    education: 'Ph.D. in Marriage and Family Therapy, University of California',
    certifications: ['Licensed Marriage and Family Therapist', 'Gottman Method Certified', 'Emotionally Focused Therapy Trained']
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialization: 'Trauma Recovery',
    experience: '10 years',
    rating: 4.9,
    prices: {
      video: 90,
      chat: 65
    },
    languages: ['English'],
    availability: 'Morning',
    image: 'https://i.pravatar.cc/150?img=4',
    bio: 'Dr. Wilson specializes in helping clients recover from trauma using EMDR and other evidence-based approaches.',
    education: 'Ph.D. in Clinical Psychology, Harvard University',
    certifications: ['Licensed Clinical Psychologist', 'EMDR Certified', 'Trauma Specialist']
  },
  {
    id: 5,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Addiction Recovery',
    experience: '7 years',
    rating: 4.8,
    prices: {
      video: 80,
      chat: 55
    },
    languages: ['English', 'Spanish'],
    availability: 'Afternoon',
    image: 'https://i.pravatar.cc/150?img=5',
    bio: 'Dr. Rodriguez has dedicated her career to helping individuals overcome addiction and build a fulfilling life in recovery.',
    education: 'Ph.D. in Clinical Psychology, University of Michigan',
    certifications: ['Licensed Clinical Psychologist', 'Addiction Specialist', 'Motivational Interviewing Certified']
  },
  {
    id: 6,
    name: 'Dr. Robert Kim',
    specialization: 'Career Counseling',
    experience: '9 years',
    rating: 4.7,
    prices: {
      video: 75,
      chat: 50
    },
    languages: ['English', 'Korean'],
    availability: 'Evening',
    image: 'https://i.pravatar.cc/150?img=6',
    bio: 'Dr. Kim helps clients navigate career transitions, find meaningful work, and develop professional skills for success.',
    education: 'Ph.D. in Counseling Psychology, University of Pennsylvania',
    certifications: ['Licensed Professional Counselor', 'Career Development Specialist', 'Executive Coach']
  }
];

const BookSession = () => {
  const [filters, setFilters] = useState({
    specialization: '',
    language: '',
    availability: '',
    priceRange: '',
    rating: '',
    sessionType: ''
  });
  
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showCounselorDetails, setShowCounselorDetails] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSessionType, setSelectedSessionType] = useState('video');
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewCounselor = (counselor) => {
    setSelectedCounselor(counselor);
    setShowCounselorDetails(true);
  };

  const handleBookCounselor = () => {
    setShowCounselorDetails(false);
    setShowBookingDialog(true);
  };

  const handleNextStep = () => {
    if (bookingStep === 0 && !selectedSessionType) {
      return; // Don't proceed if no session type is selected
    }
    setBookingStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const handleCompleteBooking = () => {
    // Here you would typically make an API call to save the booking
    setBookingComplete(true);
    setTimeout(() => {
      setShowBookingDialog(false);
      setBookingStep(0);
      setSelectedSessionType('video'); // Reset to default
      setBookingComplete(false);
    }, 2000);
  };

  const filteredCounselors = mockCounselors.filter(counselor => {
    if (filters.specialization && counselor.specialization !== filters.specialization) return false;
    if (filters.language && !counselor.languages.includes(filters.language)) return false;
    if (filters.availability && counselor.availability !== filters.availability) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const price = filters.sessionType === 'chat' ? counselor.prices.chat : counselor.prices.video;
      if (price < min || price > max) return false;
    }
    if (filters.rating && counselor.rating < Number(filters.rating)) return false;
    return true;
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#FAFAFA'
    }}>
      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Book a Session
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find the right counselor for your needs and schedule a session
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flexGrow: 1,
          minHeight: 0
        }}>
          {/* Filters Sidebar */}
          <Box sx={{ 
            flex: { md: '0 0 300px' },
            position: { md: 'sticky' },
            top: { md: 24 },
            alignSelf: { md: 'flex-start' }
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: '#F3F1FF',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Filters
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Session Type</InputLabel>
                  <Select
                    name="sessionType"
                    value={filters.sessionType}
                    onChange={handleFilterChange}
                    label="Session Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="video">Video Call</MenuItem>
                    <MenuItem value="chat">Chat</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    label="Specialization"
                  >
                    <MenuItem value="">All Specializations</MenuItem>
                    <MenuItem value="Anxiety & Depression">Anxiety & Depression</MenuItem>
                    <MenuItem value="Stress Management">Stress Management</MenuItem>
                    <MenuItem value="Relationship Counseling">Relationship Counseling</MenuItem>
                    <MenuItem value="Trauma Recovery">Trauma Recovery</MenuItem>
                    <MenuItem value="Addiction Recovery">Addiction Recovery</MenuItem>
                    <MenuItem value="Career Counseling">Career Counseling</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    name="language"
                    value={filters.language}
                    onChange={handleFilterChange}
                    label="Language"
                  >
                    <MenuItem value="">All Languages</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="Korean">Korean</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    name="availability"
                    value={filters.availability}
                    onChange={handleFilterChange}
                    label="Availability"
                  >
                    <MenuItem value="">All Times</MenuItem>
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Afternoon">Afternoon</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    label="Price Range"
                  >
                    <MenuItem value="">All Prices</MenuItem>
                    <MenuItem value="0-50">$0 - $50</MenuItem>
                    <MenuItem value="51-75">$51 - $75</MenuItem>
                    <MenuItem value="76-100">$76 - $100</MenuItem>
                    <MenuItem value="101+">$101+</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Minimum Rating</InputLabel>
                  <Select
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    label="Minimum Rating"
                  >
                    <MenuItem value="">Any Rating</MenuItem>
                    <MenuItem value="4.5">4.5+ Stars</MenuItem>
                    <MenuItem value="4.0">4.0+ Stars</MenuItem>
                    <MenuItem value="3.5">3.5+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Box>

          {/* Counselor List */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredCounselors.map((counselor) => (
              <Card 
                key={counselor.id}
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ display: 'flex', gap: 3 }}>
                  <Avatar
                    src={counselor.image}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '3px solid #2196F3'
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {counselor.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {counselor.specialization}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${filters.sessionType === 'chat' ? counselor.prices.chat : counselor.prices.video}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per {filters.sessionType === 'chat' ? 'chat' : 'video'} session
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip 
                        label={`${counselor.experience} experience`}
                        size="small"
                        sx={{ bgcolor: 'primary.light', color: 'white' }}
                      />
                      <Chip 
                        label={`${counselor.rating} ★`}
                        size="small"
                        sx={{ bgcolor: 'success.light', color: 'white' }}
                      />
                      {counselor.languages.map((lang) => (
                        <Chip 
                          key={lang}
                          label={lang}
                          size="small"
                          sx={{ bgcolor: 'grey.200' }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {counselor.bio}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleViewCounselor(counselor)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={() => {
                      setSelectedCounselor(counselor);
                      setShowBookingDialog(true);
                    }}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Counselor Details Dialog */}
      <Dialog
        open={showCounselorDetails}
        onClose={() => setShowCounselorDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCounselor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedCounselor.image}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedCounselor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedCounselor.specialization}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>About</Typography>
                  <Typography variant="body1">{selectedCounselor.bio}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>Education</Typography>
                  <Typography variant="body1">{selectedCounselor.education}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>Certifications</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCounselor.certifications.map((cert) => (
                      <Chip 
                        key={cert}
                        label={cert}
                        sx={{ bgcolor: 'primary.light', color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>Session Pricing</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        flex: 1,
                        bgcolor: 'primary.light',
                        color: 'white',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        ${selectedCounselor.prices.video}
                      </Typography>
                      <Typography variant="body2">Video Session (60 min)</Typography>
                    </Paper>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        flex: 1,
                        bgcolor: 'secondary.light',
                        color: 'white',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        ${selectedCounselor.prices.chat}
                      </Typography>
                      <Typography variant="body2">Chat Session (60 min)</Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setShowCounselorDetails(false)}>
                Close
              </Button>
              <Button 
                variant="contained"
                onClick={handleBookCounselor}
              >
                Book Session
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Booking Dialog */}
      <Dialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Book a Session with {selectedCounselor?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={bookingStep} sx={{ py: 3 }}>
            <Step>
              <StepLabel>Select Session Type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Choose Date & Time</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirm Booking</StepLabel>
            </Step>
          </Stepper>

          {bookingStep === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
              <Typography variant="h6">Choose Session Type</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    flex: 1,
                    cursor: 'pointer',
                    border: `2px solid ${selectedSessionType === 'video' ? 'primary.main' : 'grey.200'}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    bgcolor: selectedSessionType === 'video' ? 'primary.light' : 'white',
                    color: selectedSessionType === 'video' ? 'white' : 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onClick={() => setSelectedSessionType('video')}
                >
                  <Typography variant="h5" fontWeight="bold" color={selectedSessionType === 'video' ? 'white' : 'primary'}>
                    ${selectedCounselor?.prices.video}
                  </Typography>
                  <Typography variant="subtitle1">Video Session</Typography>
                  <Typography variant="body2" color={selectedSessionType === 'video' ? 'white' : 'text.secondary'}>
                    60-minute video call with your counselor
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    flex: 1,
                    cursor: 'pointer',
                    border: `2px solid ${selectedSessionType === 'chat' ? 'primary.main' : 'grey.200'}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    bgcolor: selectedSessionType === 'chat' ? 'primary.light' : 'white',
                    color: selectedSessionType === 'chat' ? 'white' : 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onClick={() => setSelectedSessionType('chat')}
                >
                  <Typography variant="h5" fontWeight="bold" color={selectedSessionType === 'chat' ? 'white' : 'primary'}>
                    ${selectedCounselor?.prices.chat}
                  </Typography>
                  <Typography variant="subtitle1">Chat Session</Typography>
                  <Typography variant="body2" color={selectedSessionType === 'chat' ? 'white' : 'text.secondary'}>
                    60-minute text chat with your counselor
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}

          {bookingStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
              <Typography variant="h6">Select Date & Time</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>
          )}

          {bookingStep === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
              <Typography variant="h6">Confirm Booking Details</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Counselor</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedCounselor?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Session Type</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedSessionType === 'video' ? 'Video Call' : 'Chat'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Date</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Not selected'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Time</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedTime ? format(selectedTime, 'hh:mm a') : 'Not selected'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${selectedSessionType === 'video' ? selectedCounselor?.prices.video : selectedCounselor?.prices.chat}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {bookingStep > 0 && (
            <Button onClick={handleBackStep}>
              Back
            </Button>
          )}
          {bookingStep < 2 ? (
            <Button 
              variant="contained"
              onClick={handleNextStep}
              disabled={
                (bookingStep === 1 && (!selectedDate || !selectedTime))
              }
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={handleCompleteBooking}
            >
              Confirm Booking
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookSession; 