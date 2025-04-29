// src/components/Insights.jsx
import React from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const moodToValue = {
  Happy: 5,
  Excited: 4,
  Calm: 3,
  Neutral: 2,
  Anxious: 1,
  Sad: 0,
  Angry: -1
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF7AC5', '#8884D8'];

const Insights = ({ entries }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  // Frequency
  const freq = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(freq).map(([name, value]) => ({ name, value }));

  // Trend
  const trendData = [...entries].reverse().map(e => ({ date: e.date, moodValue: moodToValue[e.mood] ?? 2 }));

  // Avg word count
  const avgWords = entries.length
    ? Math.round(entries.reduce((sum, e) => sum + e.content.split(' ').length, 0) / entries.length)
    : 0;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Insights & Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        View your mood distribution and trends.
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
        {/* Pie Chart */}
        <Box sx={{ width: { xs: '100%', sm: '45%', md: '40%' }, height: isSm ? 200 : 300 }}>
          <Typography align="center" gutterBottom>Mood Distribution</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={isSm ? 40 : 60}
                outerRadius={isSm ? 80 : 100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Line Chart */}
        <Box sx={{ width: { xs: '100%', sm: '45%', md: '50%' }, height: isSm ? 200 : 300 }}>
          <Typography align="center" gutterBottom>Mood Trend</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: isSm ? 10 : 12 }} />
              <YAxis domain={[-1, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="moodValue" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Average words per entry: <strong>{avgWords}</strong></Typography>
        <Typography>Total entries: <strong>{entries.length}</strong></Typography>
      </Box>
    </Paper>
  );
};

export default Insights;