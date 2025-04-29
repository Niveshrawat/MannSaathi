import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Notifications,
  Security,
  Payment,
  Schedule,
  Language,
} from '@mui/icons-material';

const CounselorSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sessionReminders: true,
      newMessages: true,
    },
    availability: {
      autoAccept: false,
      bufferTime: 15,
      maxDailySessions: 8,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    payment: {
      hourlyRate: 100,
      currency: 'USD',
      autoWithdraw: true,
    },
    language: 'English',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleNotificationChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting],
      },
    }));
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to save settings
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {/* Notifications Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications /> Notifications
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.sessionReminders}
                  onChange={() => handleNotificationChange('sessionReminders')}
                />
              }
              label="Session Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.newMessages}
                  onChange={() => handleNotificationChange('newMessages')}
                />
              }
              label="New Message Alerts"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Availability Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule /> Availability
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.availability.autoAccept}
                  onChange={(e) => handleSettingChange('availability', 'autoAccept', e.target.checked)}
                />
              }
              label="Auto-accept Session Requests"
            />
            <TextField
              sx={{ flex: '1 1 200px' }}
              type="number"
              label="Buffer Time (minutes)"
              value={settings.availability.bufferTime}
              onChange={(e) => handleSettingChange('availability', 'bufferTime', parseInt(e.target.value))}
            />
            <TextField
              sx={{ flex: '1 1 200px' }}
              type="number"
              label="Maximum Daily Sessions"
              value={settings.availability.maxDailySessions}
              onChange={(e) => handleSettingChange('availability', 'maxDailySessions', parseInt(e.target.value))}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Security Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security /> Security
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
              }
              label="Two-Factor Authentication"
            />
            <TextField
              sx={{ flex: '1 1 200px' }}
              type="number"
              label="Session Timeout (minutes)"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Payment Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment /> Payment
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              sx={{ flex: '1 1 200px' }}
              type="number"
              label="Hourly Rate"
              value={settings.payment.hourlyRate}
              onChange={(e) => handleSettingChange('payment', 'hourlyRate', parseInt(e.target.value))}
            />
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={settings.payment.currency}
                label="Currency"
                onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.payment.autoWithdraw}
                  onChange={(e) => handleSettingChange('payment', 'autoWithdraw', e.target.checked)}
                />
              }
              label="Automatic Withdrawal"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Language Settings */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Language /> Language
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ flex: '1 1 200px' }}>
              <InputLabel>Interface Language</InputLabel>
              <Select
                value={settings.language}
                label="Interface Language"
                onChange={(e) => handleSettingChange('', 'language', e.target.value)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CounselorSettings; 