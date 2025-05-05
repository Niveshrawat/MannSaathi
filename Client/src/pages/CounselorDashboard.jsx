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
import { getCounselorProfile, getCounselorAppointments, getCounselorClients, getCounselorResources } from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
                      {appointments.length}
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
                        {profile?.rating || 0}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>/5</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      {renderStars(profile?.rating || 0)}
                    </Box>
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
                    <Badge badgeContent={appointments.length} color="primary">
                      <CalendarMonth color="primary" />
                    </Badge>
                  </Box>
                  
                  {appointments.length > 0 ? (
                    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                      {appointments.map((appointment) => (
                        <Card 
                          key={appointment._id} 
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
                                src={appointment.user?.profilePicture} 
                                sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                              >
                                {appointment.user?.name?.charAt(0) || 'C'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {appointment.user?.name || 'Client'}
                                </Typography>
                                <Chip 
                                  label={appointment.status} 
                                  size="small" 
                                  color={
                                    appointment.status === 'confirmed' ? 'success' : 
                                    appointment.status === 'pending' ? 'warning' : 'error'
                                  }
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Schedule sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                              <Typography variant="body2">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Psychology sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                              <Typography variant="body2">
                                {appointment.type || 'Regular Session'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 4
                      }}
                    >
                      <CalendarMonth sx={{ fontSize: 60, color: theme.palette.text.secondary, mb: 2 }} />
                      <Typography color="text.secondary">No upcoming appointments</Typography>
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