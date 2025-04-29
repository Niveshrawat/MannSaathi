import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  Palette,
  AccessTime,
  Email,
  Phone,
  Lock,
  Save,
  Delete,
  Help,
  PrivacyTip,
} from '@mui/icons-material';
import Navbar from '../../components/CommonComponents/Navbar';

const SettingsPage = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      sessionReminders: true,
      newsletter: false,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowMessages: true,
    },
    appearance: {
      darkMode: false,
      fontSize: 'medium',
      colorScheme: 'default',
    },
    language: 'English',
    timezone: 'UTC-5',
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
    },
  });

  const handleSettingChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save settings
    setShowSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F5FD' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Paper>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          {/* Left Column - Main Settings */}
          <Box sx={{ flex: { md: '0 0 66.666%' } }}>
            {/* Notifications Settings */}
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
                Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications"
                    secondary="Receive notifications about your sessions and updates"
                  />
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={() => handleSettingChange('notifications', 'emailNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Notifications sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Session Reminders"
                    secondary="Get reminded about upcoming sessions"
                  />
                  <Switch
                    checked={settings.notifications.sessionReminders}
                    onChange={() => handleSettingChange('notifications', 'sessionReminders')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Newsletter"
                    secondary="Receive our monthly newsletter with mental health tips"
                  />
                  <Switch
                    checked={settings.notifications.newsletter}
                    onChange={() => handleSettingChange('notifications', 'newsletter')}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Privacy Settings */}
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
                Privacy
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PrivacyTip sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile Visibility"
                    secondary="Control who can see your profile"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          profileVisibility: e.target.value
                        }
                      }))}
                      size="small"
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                      <MenuItem value="friends">Friends Only</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Online Status"
                    secondary="Show when you're active"
                  />
                  <Switch
                    checked={settings.privacy.showOnlineStatus}
                    onChange={() => handleSettingChange('privacy', 'showOnlineStatus')}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Security Settings */}
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
                Security
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Lock sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleSettingChange('security', 'twoFactorAuth')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Login Notifications"
                    secondary="Get notified about new sign-ins"
                  />
                  <Switch
                    checked={settings.security.loginNotifications}
                    onChange={() => handleSettingChange('security', 'loginNotifications')}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>

          {/* Right Column - Additional Settings */}
          <Box sx={{ flex: { md: '0 0 33.333%' } }}>
            {/* Appearance Settings */}
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
                Appearance
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Palette sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                  <Switch
                    checked={settings.appearance.darkMode}
                    onChange={() => handleSettingChange('appearance', 'darkMode')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Help sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Font Size"
                    secondary="Adjust the text size"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.appearance.fontSize}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          fontSize: e.target.value
                        }
                      }))}
                      size="small"
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </Paper>

            {/* Language and Timezone */}
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
                Language & Time
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Language sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Language" />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        language: e.target.value
                      }))}
                      size="small"
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary="Timezone" />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.timezone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        timezone: e.target.value
                      }))}
                      size="small"
                    >
                      <MenuItem value="UTC-5">Eastern Time</MenuItem>
                      <MenuItem value="UTC-6">Central Time</MenuItem>
                      <MenuItem value="UTC-7">Mountain Time</MenuItem>
                      <MenuItem value="UTC-8">Pacific Time</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </Paper>

            {/* Save Button */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                py: 1.5,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 