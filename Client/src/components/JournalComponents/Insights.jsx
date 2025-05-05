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
  happy: 5,
  calm: 4,
  neutral: 3,
  anxious: 2,
  sad: 1,
  angry: 0
};

const moodColors = {
  happy: '#4CAF50',
  calm: '#2196F3',
  neutral: '#9E9E9E',
  anxious: '#FF9800',
  sad: '#F44336',
  angry: '#D32F2F'
};

const Insights = ({ entries }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  // Frequency
  const freq = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(freq).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }));

  // Trend
  const trendData = [...entries]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(e => ({ 
      date: new Date(e.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }), 
      moodValue: moodToValue[e.mood] ?? 3,
      mood: e.mood
    }));

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
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={moodColors[entry.name.toLowerCase()]} />
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
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: isSm ? 10 : 12 }} 
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(value) => {
                  const mood = Object.keys(moodToValue).find(key => moodToValue[key] === value);
                  return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : value;
                }}
              />
              <Tooltip 
                formatter={(value) => {
                  const mood = Object.keys(moodToValue).find(key => moodToValue[key] === value);
                  return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="moodValue" 
                stroke="#8884d8" 
                dot={{ fill: '#8884d8', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
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