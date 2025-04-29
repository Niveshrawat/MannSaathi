import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Chip,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Star,
  Edit,
  Add,
  CheckCircle,
  Cancel,
  Notifications,
  Message,
  Assessment,
  Schedule,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import Navbar from '../../components/CommonComponents/Navbar';
import { counselors } from '../../data/mockData';

const CounselorDashboard = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [counselor, setCounselor] = useState(null);

  useEffect(() => {
    // Get counselor data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setCounselor(userData);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddSlot = (day, slot) => {
    setSelectedSlot({ day, slot });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
  };

  const renderProfile = () => (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <Card elevation={0} sx={{ flex: { md: '0 0 30%' }, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={counselor?.profilePicture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {counselor?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {counselor?.specialization}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: 'gold' }} />
              <Typography variant="body1">{counselor?.rating}</Typography>
              <Typography variant="body2" color="text.secondary">
                ({counselor?.experience} experience)
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem>
              <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary="Location" secondary="New York, USA" />
            </ListItem>
            <ListItem>
              <Phone sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary="Phone" secondary="+1 234 567 8900" />
            </ListItem>
            <ListItem>
              <Email sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary="Email" secondary={counselor?.email} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ flex: { md: '0 0 70%' }, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Professional Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Paper elevation={0} sx={{ flex: '1 1 200px', p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Sessions
              </Typography>
              <Typography variant="h4">156</Typography>
            </Paper>
            <Paper elevation={0} sx={{ flex: '1 1 200px', p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Active Clients
              </Typography>
              <Typography variant="h4">12</Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderAppointments = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {counselor?.appointments.map((appointment) => (
        <Paper
          key={appointment.id}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>{appointment.userName[0]}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">{appointment.userName}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CalendarToday sx={{ fontSize: 16 }} />
                <Typography variant="body2">{appointment.date}</Typography>
                <AccessTime sx={{ fontSize: 16, ml: 1 }} />
                <Typography variant="body2">{appointment.time}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                size="small"
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                size="small"
              >
                Decline
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  const renderAvailability = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {counselor?.availability.map((day) => (
        <Paper
          key={day.day}
          elevation={0}
          sx={{
            flex: '1 1 300px',
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{day.day}</Typography>
            <IconButton size="small" onClick={() => handleAddSlot(day.day)}>
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {day.slots.map((slot) => (
              <Chip
                key={slot}
                label={slot}
                color="primary"
                variant="outlined"
                onDelete={() => {/* Handle slot deletion */}}
              />
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F5FD' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={counselor?.profilePicture}
                sx={{ width: 100, height: 100 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {counselor?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {counselor?.specialization}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ color: 'gold' }} />
                  <Typography variant="body1">{counselor?.rating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({counselor?.experience} experience)
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                sx={{ borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="Profile" />
              <Tab icon={<CalendarToday />} label="Appointments" />
              <Tab icon={<Schedule />} label="Availability" />
              <Tab icon={<Assessment />} label="Analytics" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {selectedTab === 0 && renderProfile()}
              {selectedTab === 1 && renderAppointments()}
              {selectedTab === 2 && renderAvailability()}
              {selectedTab === 3 && (
                <Typography variant="h6" color="text.secondary" align="center">
                  Analytics coming soon...
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Time Slot</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Time"
            margin="normal"
            defaultValue=""
          >
            {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CounselorDashboard; 