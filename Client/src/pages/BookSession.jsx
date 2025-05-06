import React, { useState, useEffect } from 'react';
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
  StepLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import Navbar from '../components/CommonComponents/Navbar';
import { getAvailableCounselors, getAvailableSlots, createBooking, getMyBookings } from '../services/api';
import { processPayment } from '../services/paymentService';

const BookSession = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        setLoading(true);
        const response = await getAvailableCounselors();
        setCounselors(response.counselors);
        setError(null);
      } catch (err) {
        setError('Failed to load counselors. Please try again later.');
        console.error('Error fetching counselors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  useEffect(() => {
    const checkExistingBookings = async () => {
      try {
        const response = await getMyBookings();
        const activeBookings = response.bookings.filter(booking => 
          booking.status === 'pending' || booking.status === 'accepted'
        );
        if (activeBookings.length > 0) {
          setExistingBooking(activeBookings[0]);
          setSnackbar({
            open: true,
            message: `You already have an active booking with ${activeBookings[0].counselor.name}`,
            severity: 'info'
          });
        }
      } catch (err) {
        console.error('Error checking existing bookings:', err);
      }
    };
    checkExistingBookings();
  }, []);

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

  useEffect(() => {
    if (showBookingDialog && selectedCounselor) {
      setSlotsLoading(true);
      setSlotsError(null);
      setAvailableSlots([]);
      setSelectedSlot(null);
      console.log('Selected counselor id:', selectedCounselor.id);
      alert('Selected counselor id: ' + selectedCounselor.id);
      getAvailableSlots(selectedCounselor.id)
        .then(res => setAvailableSlots(res.slots))
        .catch(() => setSlotsError('Failed to load available slots.'))
        .finally(() => setSlotsLoading(false));
    }
  }, [showBookingDialog, selectedCounselor]);

  const handleNextStep = () => {
    if (bookingStep === 0 && !selectedSessionType) {
      return; // Don't proceed if no session type is selected
    }
    setBookingStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const handleCompleteBooking = async () => {
    console.log('Complete booking clicked');
    if (!selectedSlot) {
      setBookingError('Please select a slot.');
      return;
    }

    if (existingBooking) {
      setBookingError('You already have an active booking. Please complete or cancel your existing booking before creating a new one.');
      return;
    }

    console.log('Opening payment dialog');
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = async () => {
    console.log('Payment complete clicked');
    setPaymentProcessing(true);
    setPaymentError(null);
    
    try {
      console.log('Creating booking...');
      const bookingResponse = await createBooking(selectedSlot._id, '');
      console.log('Booking created:', bookingResponse);
      
      console.log('Processing payment...');
      await processPayment(selectedSlot.price, bookingResponse.booking._id);
      console.log('Payment processed successfully');
      
      setBookingSuccess(true);
      setBookingComplete(true);
      setShowPaymentDialog(false);
      
      setSnackbar({
        open: true,
        message: 'Booking and payment successful!',
        severity: 'success'
      });
      
      setTimeout(() => {
        setShowBookingDialog(false);
        setBookingStep(0);
        setSelectedSessionType('video');
        setBookingComplete(false);
        setBookingSuccess(false);
        setSelectedSlot(null);
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
      setSnackbar({
        open: true,
        message: err.message || 'Payment failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const filteredCounselors = counselors.filter(counselor => {
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

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#FAFAFA'
      }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ 
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1
        }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#FAFAFA'
      }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ 
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1
        }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </Box>
    );
  }

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
          <Typography variant="h6" fontWeight="bold" component="span">
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
              <Typography variant="h6">Select an Available Slot</Typography>
              {slotsLoading ? (
                <CircularProgress />
              ) : slotsError ? (
                <Typography color="error">{slotsError}</Typography>
              ) : availableSlots.length === 0 ? (
                <Typography>No available slots for this counselor.</Typography>
              ) : (
                availableSlots.map(slot => (
                  <Paper
                    key={slot._id}
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: selectedSlot?._id === slot._id ? '2px solid #2196F3' : '1px solid #eee',
                      cursor: 'pointer',
                      bgcolor: selectedSlot?._id === slot._id ? 'primary.light' : 'white'
                    }}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Box>
                      <Typography><b>Date:</b> {slot.date}</Typography>
                      <Typography><b>Time:</b> {slot.startTime} - {slot.endTime}</Typography>
                      <Typography><b>Type:</b> {slot.sessionType}</Typography>
                      <Typography><b>Price:</b> {slot.price}</Typography>
                    </Box>
                    <Button
                      variant={selectedSlot?._id === slot._id ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {selectedSlot?._id === slot._id ? 'Selected' : 'Select'}
                    </Button>
                  </Paper>
                ))
              )}
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
              disabled={bookingStep === 1 && !selectedSlot}
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

      {existingBooking && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You already have an active booking with {existingBooking.counselor.name} on {existingBooking.slot.date} at {existingBooking.slot.startTime}.
          Please complete or cancel this booking before creating a new one.
        </Alert>
      )}

      {bookingError && (
        <Typography color="error" sx={{ mt: 1 }}>{bookingError}</Typography>
      )}
      {bookingSuccess && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          Booking successful! You will see your session in your dashboard shortly.
        </Typography>
      )}

      {/* Payment Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => !paymentProcessing && setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Complete Payment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Booking Summary
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Counselor:</Typography>
                <Typography fontWeight="bold">{selectedCounselor?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Session Type:</Typography>
                <Typography fontWeight="bold">
                  {selectedSessionType === 'video' ? 'Video Call' : 'Chat'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Date & Time:</Typography>
                <Typography fontWeight="bold">
                  {selectedSlot?.date} at {selectedSlot?.startTime}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${selectedSlot?.price}
                </Typography>
              </Box>
            </Paper>
            
            {paymentError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {paymentError}
              </Alert>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please complete the payment to confirm your booking.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowPaymentDialog(false)}
            disabled={paymentProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePaymentComplete}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookSession; 