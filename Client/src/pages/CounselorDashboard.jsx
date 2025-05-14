import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Badge,
} from '@mui/material';
import {
  CalendarMonth,
  People,
  Chat,
  Assessment,
  AccessTime,
  Edit,
  Notifications,
  Psychology,
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  Schedule,
  Person,
  Email,
  Phone,
  LocationOn,
  Star,
  StarHalf,
  StarBorder,
  MenuBook,
  Article,
} from '@mui/icons-material';
import Navbar from '../components/CommonComponents/Navbar';
import { getCounselorProfile, getCounselorAppointments, getCounselorClients, getCounselorResources, getCounselorBookings, updateBookingStatus } from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const CounselorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [completedBookings, setCompletedBookings] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, appointmentsData, clientsData, resourcesData] = await Promise.all([
          getCounselorProfile(),
          getCounselorAppointments(),
          getCounselorClients(),
          getCounselorResources()
        ]);
        
        setProfile(profileData.counselor);
        setAppointments(appointmentsData.appointments);
        setClients(clientsData.clients);
        setResources(resourcesData.data || []); // Changed to use resourcesData.data
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await getCounselorBookings();
        setBookings(response.bookings);
        setCompletedBookings(response.bookings.filter(b => b.status === 'completed' && b.feedback));
        setBookingsError(null);
      } catch (err) {
        setBookingsError('Failed to load upcoming appointments.');
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleBookingAction = async (bookingId, action) => {
    try {
      await updateBookingStatus(bookingId, action);
      setBookings(bookings => bookings.map(b => b._id === bookingId ? { ...b, status: action } : b));
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/complete`);
      setBookings(bookings => bookings.map(b => b._id === bookingId ? { ...b, status: 'completed' } : b));
    } catch (err) {
      alert('Failed to mark session as completed.');
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} sx={{ color: theme.palette.warning.main }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" sx={{ color: theme.palette.warning.main }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorder key={`empty-star-${i}`} sx={{ color: theme.palette.warning.main }} />);
    }
    
    return stars;
  };

  // Calculate active and completed sessions
  const now = new Date();
  const activeSessions = bookings.filter(b => b.status === 'accepted' && new Date(b.slot?.date + 'T' + b.slot?.startTime) > now);
  const completedSessions = bookings.filter(b => b.status === 'completed');

  // Calculate overall average rating for this counselor
  const feedbacks = bookings.filter(b => b.status === 'completed' && b.feedback && b.feedback.rating);
  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, b) => sum + b.feedback.rating, 0) / feedbacks.length).toFixed(2)
    : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome back, {profile?.name || 'Counselor'}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Here's an overview of your counseling practice
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    width: '30%', 
                    height: '100%',
                    background: `url('https://source.unsplash.com/random/400x400/?therapy,counseling')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2,
                    zIndex: 0
                  }}
                />
              </Paper>
            </motion.div>

            {/* Overall Rating Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                Your Overall Rating:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {renderStars(Number(averageRating))}
                <Typography sx={{ ml: 1 }}>
                  {averageRating}/5
                </Typography>
              </Box>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              <motion.div variants={itemVariants} style={{ flex: '1 1 200px' }}>
                <Card 
                  elevation={3}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          mr: 2
                        }}
                      >
                        <People sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">Total Clients</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {clients.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Active clients in your practice
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} style={{ flex: '1 1 200px' }}>
                <Card 
                  elevation={3}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          mr: 2
                        }}
                      >
                        <CalendarMonth sx={{ color: theme.palette.success.main, fontSize: 28 }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">Active Sessions</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {activeSessions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Scheduled appointments
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} style={{ flex: '1 1 200px' }}>
                <Card 
                  elevation={3}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          mr: 2
                        }}
                      >
                        <Article sx={{ color: theme.palette.info.main, fontSize: 28 }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">Total Resources</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold" color="info.main">
                      {resources?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Resources created by you
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} style={{ flex: '1 1 200px' }}>
                <Card 
                  elevation={3}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          mr: 2
                        }}
                      >
                        <EmojiEvents sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">Rating</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h3" fontWeight="bold" color="warning.main">
                        {averageRating}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>/5</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      {renderStars(Number(averageRating))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} style={{ flex: '1 1 200px' }}>
                <Card 
                  elevation={3}
                  sx={{ 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircle sx={{ color: theme.palette.info.main, fontSize: 28, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Completed Sessions</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold" color="info.main">
                      {completedSessions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Sessions completed
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* Profile Summary */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 60%', minWidth: '300px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Profile Summary
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<Edit />}
                      sx={{ borderRadius: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Person sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography><strong>Name:</strong> {profile?.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Psychology sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography><strong>Specialization:</strong> {profile?.specialization}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography><strong>Experience:</strong> {profile?.experience} years</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Star sx={{ color: theme.palette.warning.main, mr: 1 }} />
                        <Typography><strong>Rating:</strong> {profile?.rating}/5</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <People sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography><strong>Total Clients:</strong> {clients.length}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarMonth sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography><strong>Total Appointments:</strong> {appointments.length}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      icon={<Email />} 
                      label={profile?.email || 'email@example.com'} 
                      variant="outlined" 
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip 
                      icon={<Phone />} 
                      label={profile?.phone || '+1 234 567 8900'} 
                      variant="outlined" 
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip 
                      icon={<LocationOn />} 
                      label={profile?.location || 'New York, USA'} 
                      variant="outlined" 
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                </Paper>
              </motion.div>

              {/* Upcoming Appointments */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 30%', minWidth: '250px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Upcoming Appointments
                    </Typography>
                    <Badge badgeContent={bookings.length} color="primary">
                      <CalendarMonth color="primary" />
                    </Badge>
                  </Box>
                  {bookingsLoading ? (
                    <Typography>Loading...</Typography>
                  ) : bookingsError ? (
                    <Typography color="error">{bookingsError}</Typography>
                  ) : bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length === 0 ? (
                    <Typography>No upcoming appointments.</Typography>
                  ) : (
                    <Box>
                      {bookings
                        .filter(b => b.status === 'pending' || b.status === 'accepted')
                        .map((booking) => {
                          const now = new Date();
                          const slotDate = booking.slot?.date;
                          const start = slotDate ? new Date(`${slotDate}T${booking.slot?.startTime}`) : null;
                          const end = slotDate ? new Date(`${slotDate}T${booking.slot?.endTime}`) : null;
                          const canJoin = booking.status === 'accepted' && start && end && now >= start && now <= end && booking.slot?.sessionType === 'chat';
                          return (
                            <Card 
                              key={booking._id} 
                              sx={{ 
                                mb: 2, 
                                borderRadius: 2,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                  transform: 'translateX(5px)',
                                  boxShadow: theme.shadows[3]
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Avatar 
                                    src={booking.user?.profilePicture} 
                                    sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                                  >
                                    {booking.user?.name?.charAt(0) || 'C'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {booking.user?.name || 'Client'}
                                    </Typography>
                                    <Chip 
                                      label={booking.status} 
                                      size="small" 
                                      color={
                                        booking.status === 'accepted' ? 'success' : 
                                        booking.status === 'pending' ? 'warning' : 'error'
                                      }
                                      sx={{ mt: 0.5 }}
                                    />
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Schedule sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2">
                                    {booking.slot?.date} at {booking.slot?.startTime}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Psychology sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2">
                                    {booking.slot?.sessionType === 'audio' ? 'Audio' : 'Chat'}
                                  </Typography>
                                </Box>
                                {booking.status === 'pending' && (
                                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button variant="contained" color="success" onClick={() => handleBookingAction(booking._id, 'accepted')}>Accept</Button>
                                    <Button variant="outlined" color="error" onClick={() => handleBookingAction(booking._id, 'rejected')}>Reject</Button>
                                  </Box>
                                )}
                                {canJoin && (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/session?id=' + booking._id)}
                                  >
                                    Join Session
                                  </Button>
                                )}
                                {booking.status === 'accepted' && !canJoin && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate('/session?id=' + booking._id)}
                                  >
                                    View Details
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                    </Box>
                  )}
                </Paper>
              </motion.div>

              {/* Client Feedback Section */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 30%', minWidth: '250px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Client Feedback
                    </Typography>
                    <Badge badgeContent={completedBookings.length} color="primary">
                      <Star color="primary" />
                    </Badge>
                  </Box>
                  {completedBookings.length === 0 ? (
                    <Typography>No feedback received yet.</Typography>
                  ) : (
                    <Box>
                      {completedBookings.map((booking) => (
                        <Card 
                          key={booking._id} 
                          sx={{ 
                            mb: 2, 
                            borderRadius: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateX(5px)',
                              boxShadow: theme.shadows[3]
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar 
                                src={booking.user?.profilePicture} 
                                sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                              >
                                {booking.user?.name?.charAt(0) || 'C'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {booking.user?.name || 'Client'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {booking.slot?.date} at {booking.slot?.startTime}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {renderStars(booking.feedback.rating)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {booking.feedback.rating}/5
                              </Typography>
                            </Box>
                            {booking.feedback.comment && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                "{booking.feedback.comment}"
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Paper>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 30%', minWidth: '250px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CalendarMonth />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        }
                      }}
                    >
                      Schedule New Session
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Chat />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      View Messages
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Assessment />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      Generate Reports
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MenuBook />}
                      onClick={() => navigate('/resources/editor')}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      Create Resource
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Notifications />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      Manage Notifications
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default CounselorDashboard; 