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
} from '@mui/material';
import {
  CalendarMonth,
  People,
  Chat,
  Assessment,
  AccessTime,
} from '@mui/icons-material';
import Navbar from '../components/CommonComponents/Navbar';

const CounselorDashboard = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      clientName: 'John Doe',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Video Call',
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      date: '2024-03-20',
      time: '2:00 PM',
      type: 'In Person',
    },
  ]);

  const [stats, setStats] = useState({
    totalClients: 15,
    activeSessions: 8,
    completedSessions: 45,
    averageRating: 4.8,
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Welcome Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, Counselor!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your counseling practice
            </Typography>
          </Paper>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Card sx={{ flex: '1 1 200px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Total Clients</Typography>
                </Box>
                <Typography variant="h4">{stats.totalClients}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonth sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Active Sessions</Typography>
                </Box>
                <Typography variant="h4">{stats.activeSessions}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Completed</Typography>
                </Box>
                <Typography variant="h4">{stats.completedSessions}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chat sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Rating</Typography>
                </Box>
                <Typography variant="h4">{stats.averageRating}/5</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Upcoming Sessions */}
            <Paper sx={{ p: 3, flex: '1 1 60%', minWidth: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Sessions
              </Typography>
              <List>
                {upcomingSessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{session.clientName[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={session.clientName}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AccessTime fontSize="small" />
                            <Typography component="span" variant="body2">
                              {session.date} at {session.time}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              {session.type}
                            </Typography>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'span' }}
                      />
                      <Button variant="contained" size="small">
                        Join Session
                      </Button>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, flex: '1 1 30%', minWidth: '250px' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CalendarMonth />}
                >
                  Schedule New Session
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Chat />}
                >
                  View Messages
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assessment />}
                >
                  Generate Reports
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CounselorDashboard; 