import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  PhotoCamera,
  Edit as EditIcon,
  Save as SaveIcon,
  Person,
  Psychology,
  TrendingUp,
  Star,
  StarHalf,
  StarBorder,
  Email,
  Phone,
  LocationOn,
  CalendarMonth,
  People,
  EmojiEvents,
  CheckCircle,
} from '@mui/icons-material';
import Navbar from '../components/CommonComponents/Navbar';
import { getCounselorProfile, updateCounselorProfile } from '../services/api';
import { motion } from 'framer-motion';

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

const CounselorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    profilePicture: ''
  });
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getCounselorProfile();
        setProfile(response.counselor);
        setFormData({
          name: response.counselor.name || '',
          specialization: response.counselor.specialization || '',
          experience: response.counselor.experience || '',
          profilePicture: response.counselor.profilePicture || ''
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await updateCounselorProfile(formData);
      setSuccess(true);
      setIsEditing(false);
      
      // Refresh profile data
      const response = await getCounselorProfile();
      setProfile(response.counselor);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
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
                    Profile
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Manage your professional information and settings
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

            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div variants={itemVariants}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Profile updated successfully!
                </Alert>
              </motion.div>
            )}

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {/* Profile Picture and Basic Info */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 300px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 200,
                        height: 200,
                        border: `4px solid ${theme.palette.primary.main}`,
                        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                      src={isEditing ? formData.profilePicture : profile?.profilePicture}
                    />
                    {isEditing && (
                      <Tooltip title="Upload Photo">
                        <IconButton
                          component="label"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark,
                            }
                          }}
                        >
                          <PhotoCamera />
                          <input hidden accept="image/*" type="file" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {isEditing ? formData.name : profile?.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {isEditing ? formData.specialization : profile?.specialization}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                      {renderStars(profile?.rating || 0)}
                      <Typography variant="body2" color="text.secondary">
                        ({profile?.rating || 0}/5)
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: '100%', mt: 'auto' }}>
                    <Button
                      variant={isEditing ? "contained" : "outlined"}
                      fullWidth
                      startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                      onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                      disabled={saving}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        ...(isEditing && {
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          }
                        })
                      }}
                    >
                      {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </Box>
                </Paper>
              </motion.div>

              {/* Profile Details */}
              <motion.div variants={itemVariants} style={{ flex: '2 1 500px' }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Professional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          fullWidth
                          required
                          disabled={!isEditing}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          fullWidth
                          required
                          disabled={!isEditing}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Years of Experience"
                          name="experience"
                          type="number"
                          value={formData.experience}
                          onChange={handleChange}
                          fullWidth
                          required
                          disabled={!isEditing}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Profile Picture URL"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleChange}
                          fullWidth
                          disabled={!isEditing}
                          helperText="Enter a URL for your profile picture"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>
                  </form>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Contact Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
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
                  </Box>
                </Paper>
              </motion.div>
            </Box>

            {/* Profile Statistics */}
            <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Profile Statistics
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      flex: '1 1 200px',
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            mr: 2
                          }}
                        >
                          <EmojiEvents sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">Rating</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="primary">
                        {profile?.rating || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Average client rating
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card 
                    elevation={0}
                    sx={{ 
                      flex: '1 1 200px',
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.1)
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.success.main, 0.2),
                            mr: 2
                          }}
                        >
                          <CalendarMonth sx={{ color: theme.palette.success.main, fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">Total Appointments</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="success.main">
                        {profile?.totalAppointments || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Completed sessions
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card 
                    elevation={0}
                    sx={{ 
                      flex: '1 1 200px',
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1)
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                            mr: 2
                          }}
                        >
                          <People sx={{ color: theme.palette.info.main, fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">Active Clients</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="info.main">
                        {profile?.activeClients || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Current client base
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card 
                    elevation={0}
                    sx={{ 
                      flex: '1 1 200px',
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.1)
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: '50%', 
                            bgcolor: alpha(theme.palette.warning.main, 0.2),
                            mr: 2
                          }}
                        >
                          <CheckCircle sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">Experience</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="warning.main">
                        {profile?.experience || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Years of practice
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default CounselorProfile; 