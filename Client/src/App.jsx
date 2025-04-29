import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Journal from './pages/Journal';
import ChatPage from './pages/ChatPage';
import BookSession from './pages/BookSession';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserDashboard from './pages/Dashboard/UserDashboard';
import SessionPage from './pages/Session/SessionPage';
import VideoSession from './pages/Session/VideoSession';
import ChatSession from './pages/Session/ChatSession';
import ProgressPage from './pages/Progress/ProgressPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';
import CounselorDashboard from './pages/CounselorDashboard';
import CounselorProfile from './pages/CounselorProfile';
import CounselorSettings from './pages/CounselorSettings';
import { authAPI } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/session/:type" element={<SessionPage />} />
            <Route path="/session/video" element={<VideoSession />} />
            <Route path="/session/chat" element={<ChatSession />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/counselor-dashboard"
              element={
                <ProtectedRoute>
                  <CounselorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor-profile"
              element={
                <ProtectedRoute>
                  <CounselorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor-settings"
              element={
                <ProtectedRoute>
                  <CounselorSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
