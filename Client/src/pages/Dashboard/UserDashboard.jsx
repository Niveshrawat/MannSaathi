import React, { useState, useEffect } from 'react';
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
  ListItemAvatar,
  IconButton,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiTablePaper,
  Tooltip,
} from '@mui/material';
import {
  VideoCall,
  Chat,
  CalendarMonth,
  Assessment,
  Edit,
  NavigateNext,
  CheckCircle,
  Schedule,
  TrendingUp,
  Mood,
  Timer,
  AccessTime,
  Person,
  Psychology,
  Star,
  StarHalf,
  StarBorder,
  Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import Navbar from '../../components/CommonComponents/Navbar';
import { getMyBookings } from '../../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [openSessionsDialog, setOpenSessionsDialog] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [bookings, setBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    nextSession: {
      counselor: 'Dr. Sarah Johnson',
      date: 'March 15, 2024',
      time: '10:00 AM',
      type: 'Video Call',
    },
    progress: {
      sessionsCompleted: 8,
      totalSessions: 12,
      lastSession: '2024-03-01',
      nextGoal: 'Develop better stress management techniques',
      moodData: [
        { date: 'Week 1', mood: 5 },
        { date: 'Week 2', mood: 6 },
        { date: 'Week 3', mood: 4 },
        { date: 'Week 4', mood: 7 },
        { date: 'Week 5', mood: 8 },
        { date: 'Week 6', mood: 7 },
        { date: 'Week 7', mood: 9 },
        { date: 'Week 8', mood: 8 },
      ],
      sessionTypes: [
        { name: 'Video Call', value: 5 },
        { name: 'Chat', value: 2 },
        { name: 'Voice Call', value: 1 },
      ],
      weeklyMinutes: [
        { name: 'Mon', minutes: 30 },
        { name: 'Tue', minutes: 45 },
        { name: 'Wed', minutes: 60 },
        { name: 'Thu', minutes: 30 },
        { name: 'Fri', minutes: 45 },
        { name: 'Sat', minutes: 15 },
        { name: 'Sun', minutes: 0 },
      ],
    },
    recentSessions: [
      {
        id: 1,
        counselor: 'Dr. Sarah Johnson',
        date: 'March 1, 2024',
        type: 'Video Call',
        notes: 'Discussed work-related stress and coping mechanisms',
      },
      {
        id: 2,
        counselor: 'Dr. Michael Chen',
        date: 'February 15, 2024',
        type: 'Chat',
        notes: 'Follow-up on anxiety management techniques',
      },
    ],
    upcomingSessions: [
      {
        id: 3,
        counselor: 'Dr. Sarah Johnson',
        counselorAvatar: 'https://i.pravatar.cc/150?img=5',
        date: 'March 15, 2024',
        time: '10:00 AM',
        type: 'Video Call',
        status: 'upcoming',
      },
      {
        id: 4,
        counselor: 'Dr. Priya Patel',
        counselorAvatar: 'https://i.pravatar.cc/150?img=6',
        date: 'March 22, 2024',
        time: '2:00 PM',
        type: 'Video Call',
        status: 'upcoming',
      },
      {
        id: 5,
        counselor: 'Dr. Michael Chen',
        counselorAvatar: 'https://i.pravatar.cc/150?img=7',
        date: 'March 29, 2024',
        time: '11:30 AM',
        type: 'Chat',
        status: 'upcoming',
      },
    ],
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const quickActions = [
    {
      icon: <VideoCall sx={{ fontSize: 40 }} />,
      title: 'Join Session',
      action: () => setOpenSessionsDialog(true),
      disabled: false,
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: 'Chat Support',
      action: () => navigate('/chat'),
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      title: 'Book Session',
      action: () => navigate('/book-session'),
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'View Progress',
      action: () => navigate('/progress'),
    },
  ];

  const handleJoinSession = (sessionId) => {
    setOpenSessionsDialog(false);
    navigate(`/session?id=${sessionId}`);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await getMyBookings();
        setBookings(response.bookings.filter(b => b.status === 'pending' || b.status === 'accepted'));
        setCompletedBookings(response.bookings.filter(b => b.status === 'completed'));
        setBookingsError(null);
      } catch (err) {
        setBookingsError('Failed to load upcoming sessions.');
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} sx={{ color: 'warning.main' }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" sx={{ color: 'warning.main' }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorder key={`empty-star-${i}`} sx={{ color: 'warning.main' }} />);
    }
    
    return stars;
  };

  const DashboardInsights = ({ user }) => {
    // Calculate mood distribution
    const moodDistribution = user.progress.moodData.reduce((acc, data) => {
      const moodLevel = Math.floor(data.mood / 2);
      acc[moodLevel] = (acc[moodLevel] || 0) + 1;
      return acc;
    }, {});

    const moodData = Object.entries(moodDistribution).map(([level, count]) => ({
      name: `Level ${level}`,
      value: count
    }));

    const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B72AA'];

    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Psychology sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Mental Wellness Insights
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Track your mood patterns and session effectiveness
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 4
          }}
        >
          {/* Mood Distribution Chart */}
          <Box sx={{ width: { xs: '100%', sm: '45%', md: '40%' }, height: isSm ? 200 : 300 }}>
            <Typography align="center" gutterBottom>Mood Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={isSm ? 40 : 60}
                  outerRadius={isSm ? 80 : 100}
                  label
                >
                  {moodData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Mood Trend Chart */}
          <Box sx={{ width: { xs: '100%', sm: '45%', md: '50%' }, height: isSm ? 200 : 300 }}>
            <Typography align="center" gutterBottom>Mood Trend</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.progress.moodData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: isSm ? 10 : 12 }} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>
            Average Mood: <strong>{Math.round(user.progress.moodData.reduce((sum, data) => sum + data.mood, 0) / user.progress.moodData.length)}</strong>/10
          </Typography>
          <Typography>
            Sessions Completed: <strong>{user.progress.sessionsCompleted}</strong>
          </Typography>
        </Box>
      </Paper>
    );
  };

  // Helper to get session status and color
  const getSessionStatus = (booking) => {
    const now = new Date();
    const slotDate = booking.slot?.date;
    const start = slotDate ? new Date(`${slotDate}T${booking.slot?.startTime}`) : null;
    const end = slotDate ? new Date(`${slotDate}T${booking.slot?.endTime}`) : null;
    if (booking.status === 'completed') return { label: 'Completed', color: 'success' };
    if (booking.status === 'cancelled' || booking.status === 'rejected') return { label: 'Cancelled', color: 'error' };
    if (start && end && now >= start && now <= end && (booking.status === 'accepted' || booking.status === 'pending')) return { label: 'Active', color: 'info' };
    if (start && now < start && (booking.status === 'accepted' || booking.status === 'pending')) return { label: 'Scheduled', color: 'primary' };
    if (start && now > end && booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'rejected') return { label: 'Missed', color: 'warning' };
    return { label: booking.status, color: 'default' };
  };

  // Helper to get session end time
  const getSessionEnd = (booking) => {
    const slotDate = booking.slot?.date;
    return slotDate ? new Date(`${slotDate}T${booking.slot?.endTime}`) : null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F5FD' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box 
          sx={{ 
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid #2196F3',
              boxShadow: '0 4px 10px rgba(33, 150, 243, 0.2)'
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your next session is on {user.nextSession.date} at {user.nextSession.time}
            </Typography>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            justifyContent: { xs: 'center', sm: 'space-between' }
          }}
        >
          {quickActions.map((action, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                cursor: action.disabled ? 'not-allowed' : 'pointer',
                opacity: action.disabled ? 0.7 : 1,
                flex: { xs: '1 1 calc(50% - 12px)', sm: '1 1 calc(25% - 24px)' },
                minWidth: { xs: '140px', sm: '180px' },
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                  bgcolor: action.disabled ? 'inherit' : 'action.hover',
                },
              }}
              onClick={action.disabled ? undefined : action.action}
            >
              {action.icon}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {action.title}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Insights Section */}
        <DashboardInsights user={user} />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column */}
          <Box sx={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Mood Progress Chart */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Mood sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Mood Progress
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={user.progress.moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="mood" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Weekly Activity Chart */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Weekly Activity
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={user.progress.weeklyMinutes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="minutes" stroke="#2196F3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Upcoming Sessions */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Sessions
                </Typography>
                <Button 
                  endIcon={<NavigateNext />} 
                  onClick={() => navigate('/sessions')}
                  sx={{ 
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              {bookingsLoading ? (
                <Typography>Loading...</Typography>
              ) : bookingsError ? (
                <Typography color="error">{bookingsError}</Typography>
              ) : bookings.length === 0 ? (
                <Typography>No upcoming sessions.</Typography>
              ) : (
                <List>
                  {bookings.map((booking) => {
                    const now = new Date();
                    const slotDate = booking.slot?.date;
                    const start = slotDate ? new Date(`${slotDate}T${booking.slot?.startTime}`) : null;
                    const end = slotDate ? new Date(`${slotDate}T${booking.slot?.endTime}`) : null;
                    const canJoin = booking.status === 'accepted' && start && end && now >= start && now <= end && booking.slot?.sessionType === 'chat';
                    return (
                    <ListItem 
                      key={booking._id} 
                      sx={{ 
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        mb: 1,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={booking.counselor?.profilePicture || ''} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={booking.counselor?.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {booking.slot?.date} at {booking.slot?.startTime}
                              </Typography>
                              {/* Status Chip */}
                              <Chip
                                label={getSessionStatus(booking).label}
                                color={getSessionStatus(booking).color}
                                size="small"
                                sx={{ mt: 0.5, mr: 1 }}
                              />
                              {booking.feedback ? (
                                <Box sx={{ mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {renderStars(booking.feedback.rating)}
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                      {booking.feedback.rating}/5
                                    </Typography>
                                  </Box>
                                  {booking.feedback.comment && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                      "{booking.feedback.comment}"
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No feedback provided
                                </Typography>
                              )}
                            </Box>
                          }
                      />
                      <Chip 
                          label={booking.slot?.sessionType === 'audio' ? 'Audio' : 'Chat'} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                        {canJoin ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/session?id=' + booking._id)}
                          >
                            Join Session
                          </Button>
                        ) : (
                      <IconButton 
                        onClick={() => navigate('/session?id=' + booking._id)}
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(33, 150, 243, 0.08)'
                          }
                        }}
                      >
                        <NavigateNext />
                      </IconButton>
                        )}
                    </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Session Distribution */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Session Distribution
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={user.progress.sessionTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {user.progress.sessionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {user.progress.sessionTypes.map((type, index) => (
                  <Box key={type.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: COLORS[index % COLORS.length],
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {type.name}: {type.value} sessions
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Progress Card */}
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.2)'
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Your Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Session Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(user.progress.sessionsCompleted / user.progress.totalSessions) * 100}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {user.progress.sessionsCompleted} of {user.progress.totalSessions} sessions completed
                  </Typography>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Next Goal
                </Typography>
                <Typography variant="body2">
                  {user.progress.nextGoal}
                </Typography>
              </CardContent>
            </Card>

            {/* Quick Notes */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Quick Notes
                </Typography>
                <IconButton 
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                >
                  <Edit />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Remember to practice the breathing exercises discussed in your last session.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next session focus: Stress management techniques
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Completed Sessions with Feedback */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Completed Sessions
            </Typography>
          </Box>
          {completedBookings.length === 0 ? (
            <Typography>No completed sessions yet.</Typography>
          ) : (
            <List>
              {completedBookings.map((booking) => (
                <ListItem 
                  key={booking._id}
                  sx={{ 
                    bgcolor: '#ffffff',
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={booking.counselor?.profilePicture || ''} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={booking.counselor?.name}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {booking.slot?.date} at {booking.slot?.startTime}
                        </Typography>
                        {booking.feedback ? (
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {renderStars(booking.feedback.rating)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {booking.feedback.rating}/5
                              </Typography>
                            </Box>
                            {booking.feedback.comment && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                "{booking.feedback.comment}"
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No feedback provided
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Session History Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 3,
            background: 'linear-gradient(135deg, #F0F5FD 0%, #ffffff 100%)',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.08)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Schedule sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Session History
            </Typography>
          </Box>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: 18, mr: 0.5 }} /> Counselor
                    </Box>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedBookings
                  .filter(booking => booking.status === 'completed')
                  .map((booking) => (
                    <TableRow key={booking._id} hover>
                      <TableCell>{booking.slot?.date}</TableCell>
                      <TableCell>{booking.slot?.startTime} - {booking.slot?.endTime}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={booking.counselor?.profilePicture} sx={{ width: 28, height: 28, mr: 1 }} />
                          {booking.counselor?.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getSessionStatus(booking).label === 'Completed' ? <CheckCircle fontSize="small" /> : undefined}
                          label={getSessionStatus(booking).label}
                          color={getSessionStatus(booking).color}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        {booking.feedback ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderStars(booking.feedback.rating)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {booking.feedback.rating}/5
                            </Typography>
                            {booking.feedback.comment && (
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                                “{booking.feedback.comment}”
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No feedback
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Upcoming Sessions Dialog */}
      <Dialog 
        open={openSessionsDialog} 
        onClose={() => setOpenSessionsDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VideoCall sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Join a Session</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {user.upcomingSessions.map((session) => (
              <ListItemButton
                key={session.id}
                onClick={() => handleJoinSession(session.id)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    bgcolor: 'rgba(33, 150, 243, 0.08)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={session.counselorAvatar} alt={session.counselor} />
                </ListItemAvatar>
                <ListItemText
                  primary={session.counselor}
                  secondary={`${session.date} at ${session.time}`}
                />
                <Chip 
                  label={session.type} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                <IconButton 
                  onClick={() => handleJoinSession(session.id)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                >
                  <VideoCall />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenSessionsDialog(false)}
            sx={{
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(33, 150, 243, 0.08)'
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard; 