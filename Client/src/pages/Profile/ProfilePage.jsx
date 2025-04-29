import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Switch,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit,
  Person,
  Email,
  Phone,
  Language,
  Notifications,
  Security,
  Psychology,
  CalendarMonth,
  AccessTime,
  LocationOn,
  Save,
  Cancel,
} from '@mui/icons-material';
import Navbar from '../../components/CommonComponents/Navbar';

const ProfilePage = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    language: 'English',
    timezone: 'UTC-5',
    bio: 'Mental wellness enthusiast seeking personal growth and emotional balance.',
    preferences: {
      emailNotifications: true,
      sessionReminders: true,
      newsletter: false,
      darkMode: false,
    },
    stats: {
      sessionsCompleted: 24,
      totalHours: 36,
      journalEntries: 45,
      goalsAchieved: 12,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to update the user data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F5FD' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src="https://i.pravatar.cc/150?img=3"
              sx={{
                width: 100,
                height: 100,
                border: '3px solid #2196F3',
                boxShadow: '0 4px 10px rgba(33, 150, 243, 0.2)',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {userData.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {userData.bio}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Psychology />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  View Progress
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          {/* Left Column - Personal Information */}
          <Box sx={{ flex: { md: '0 0 66.666%' } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          value={userData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        userData.name
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          value={userData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        userData.email
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          value={userData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        userData.phone
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          value={userData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        userData.location
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Language sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary={userData.language}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Timezone"
                    secondary={userData.timezone}
                  />
                </ListItem>
              </List>
              {isEditing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Right Column - Preferences and Stats */}
          <Box sx={{ flex: { md: '0 0 33.333%' } }}>
            {/* Preferences */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Email Notifications" />
                  <Switch
                    checked={userData.preferences.emailNotifications}
                    onChange={() => handlePreferenceChange('emailNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonth sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Session Reminders" />
                  <Switch
                    checked={userData.preferences.sessionReminders}
                    onChange={() => handlePreferenceChange('sessionReminders')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Newsletter" />
                  <Switch
                    checked={userData.preferences.newsletter}
                    onChange={() => handlePreferenceChange('newsletter')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                  <Switch
                    checked={userData.preferences.darkMode}
                    onChange={() => handlePreferenceChange('darkMode')}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Stats */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Stats
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2 
              }}>
                <Card
                  elevation={0}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '120px',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">
                      {userData.stats.sessionsCompleted}
                    </Typography>
                    <Typography variant="body2">Sessions</Typography>
                  </CardContent>
                </Card>
                <Card
                  elevation={0}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '120px',
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">
                      {userData.stats.totalHours}
                    </Typography>
                    <Typography variant="body2">Hours</Typography>
                  </CardContent>
                </Card>
                <Card
                  elevation={0}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '120px',
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">
                      {userData.stats.journalEntries}
                    </Typography>
                    <Typography variant="body2">Entries</Typography>
                  </CardContent>
                </Card>
                <Card
                  elevation={0}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '120px',
                    bgcolor: 'info.light',
                    color: 'info.contrastText',
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" fontWeight="bold">
                      {userData.stats.goalsAchieved}
                    </Typography>
                    <Typography variant="body2">Goals</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage; 