import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  CalendarMonth,
  Timer,
  EmojiEmotions,
  Assessment,
  CheckCircle,
  Schedule,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import Navbar from '../../components/CommonComponents/Navbar';

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data for progress tracking
  const progressData = {
    overallProgress: {
      sessionsCompleted: 24,
      totalHours: 36,
      averageMood: 7.5,
      consistencyScore: 85,
      streak: 12,
    },
    moodData: [
      { date: 'Jan', mood: 6, anxiety: 4, stress: 5 },
      { date: 'Feb', mood: 7, anxiety: 3, stress: 4 },
      { date: 'Mar', mood: 8, anxiety: 2, stress: 3 },
      { date: 'Apr', mood: 7, anxiety: 3, stress: 4 },
      { date: 'May', mood: 8, anxiety: 2, stress: 3 },
      { date: 'Jun', mood: 9, anxiety: 2, stress: 2 },
    ],
    sessionTypes: [
      { name: 'Video Call', value: 15 },
      { name: 'Chat', value: 6 },
      { name: 'Voice Call', value: 3 },
    ],
    weeklyActivity: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 30 },
      { day: 'Wed', minutes: 60 },
      { day: 'Thu', minutes: 45 },
      { day: 'Fri', minutes: 30 },
      { day: 'Sat', minutes: 15 },
      { day: 'Sun', minutes: 0 },
    ],
    goals: [
      {
        title: 'Reduce Anxiety',
        progress: 75,
        status: 'In Progress',
        target: 'Reduce anxiety levels by 50%',
      },
      {
        title: 'Improve Sleep',
        progress: 60,
        status: 'In Progress',
        target: 'Get 7-8 hours of sleep consistently',
      },
      {
        title: 'Stress Management',
        progress: 85,
        status: 'On Track',
        target: 'Implement stress reduction techniques',
      },
    ],
    recentAchievements: [
      {
        title: 'Consistent Session Attendance',
        description: 'Attended 12 sessions in a row',
        date: '2024-03-15',
        icon: <CheckCircle />,
      },
      {
        title: 'Mood Improvement',
        description: 'Average mood increased by 2 points',
        date: '2024-03-10',
        icon: <EmojiEmotions />,
      },
      {
        title: 'Goal Achievement',
        description: 'Completed stress management goal',
        date: '2024-03-05',
        icon: <Assessment />,
      },
    ],
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const ProgressCard = ({ title, value, icon, trend, color }) => (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, color: color || 'primary.main' }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trend > 0 ? (
            <ArrowUpward sx={{ color: 'success.main', mr: 0.5 }} />
          ) : (
            <ArrowDownward sx={{ color: 'error.main', mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : 'error.main'}
          >
            {Math.abs(trend)}% from last month
          </Typography>
        </Box>
      )}
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F5FD' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your mental health journey and achievements
          </Typography>
        </Box>

        {/* Progress Overview Cards */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <ProgressCard
              title="Sessions Completed"
              value={progressData.overallProgress.sessionsCompleted}
              icon={<CalendarMonth sx={{ color: 'primary.main' }} />}
              trend={15}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <ProgressCard
              title="Total Hours"
              value={progressData.overallProgress.totalHours}
              icon={<Timer sx={{ color: 'secondary.main' }} />}
              trend={20}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <ProgressCard
              title="Average Mood"
              value={progressData.overallProgress.averageMood}
              icon={<EmojiEmotions sx={{ color: 'success.main' }} />}
              trend={10}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <ProgressCard
              title="Consistency Score"
              value={`${progressData.overallProgress.consistencyScore}%`}
              icon={<TrendingUp sx={{ color: 'info.main' }} />}
              trend={5}
            />
          </Box>
        </Box>

        {/* Tabs Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Mood Tracking" />
            <Tab label="Goals" />
            <Tab label="Achievements" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Mood Trends Chart */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Mood Trends
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer>
                      <AreaChart data={progressData.moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="anxiety"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="stress"
                          stackId="1"
                          stroke="#ffc658"
                          fill="#ffc658"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Session Distribution */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Session Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={progressData.sessionTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {progressData.sessionTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Weekly Activity */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Weekly Activity
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={progressData.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="minutes" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Detailed Mood Analysis */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Mood Analysis
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer>
                      <LineChart data={progressData.moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="anxiety"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#ffc658"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {progressData.goals.map((goal, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{goal.title}</Typography>
                        <Chip
                          label={goal.status}
                          color={goal.progress >= 80 ? 'success' : 'primary'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {goal.target}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                          {goal.progress}% Complete
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {progressData.recentAchievements.map((achievement, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ffffff 0%, #F0F5FD 100%)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon>
                          <IconButton
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            }}
                          >
                            {achievement.icon}
                          </IconButton>
                        </ListItemIcon>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6">{achievement.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.date}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProgressPage; 