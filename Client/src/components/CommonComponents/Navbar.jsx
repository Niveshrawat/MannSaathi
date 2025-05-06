// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  Settings,
  Logout,
  CalendarMonth,
  Chat,
  Book,
  MenuBook,
} from '@mui/icons-material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('token');
  const iscounselor = user?.role === 'counselor';

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eaeaea' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            MannSaathi
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => handleMenuClick('/book-session')}>
                <ListItemIcon>
                  <CalendarMonth fontSize="small" />
                </ListItemIcon>
                Book Session
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick('/chat')}>
                <ListItemIcon>
                  <Chat fontSize="small" />
                </ListItemIcon>
                Chat Support
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick('/journal')}>
                <ListItemIcon>
                  <MenuBook fontSize="small" />
                </ListItemIcon>
                Journal
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick('/resources')}>
                <ListItemIcon>
                  <Book fontSize="small" />
                </ListItemIcon>
                Resources
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            MindfulMate
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              onClick={() => handleMenuClick('/book-session')}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Book Session
            </Button>
            <Button
              onClick={() => handleMenuClick('/chat')}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Chat Support
            </Button>
                  <Button
              onClick={() => handleMenuClick('/journal')}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
                  >
              Journal
                  </Button>
              <Button
              onClick={() => handleMenuClick('/resources')}
                sx={{
                color: 'text.primary',
                  textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                }}
              >
              Resources
              </Button>
          </Box>

          {/* User menu - only show if authenticated */}
          {isAuthenticated ? (
            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || 'User'}
                    src={user?.avatar}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid #2196F3',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                {iscounselor ? [
                  <MenuItem key="dashboard" onClick={() => handleMenuClick('/counselor-dashboard')}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Counselor Dashboard
                  </MenuItem>,
                  <MenuItem key="profile" onClick={() => handleMenuClick('/counselor-profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>,
                  <MenuItem key="settings" onClick={() => handleMenuClick('/counselor-settings')}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>,
                  <MenuItem key="slots" onClick={() => handleMenuClick('/counselor-slots')}>
                    <ListItemIcon>
                      <CalendarMonth fontSize="small" />
                    </ListItemIcon>
                    Manage Slots
                  </MenuItem>,
                  <MenuItem key="my-resources" onClick={() => {
                    handleCloseUserMenu();
                    navigate('/resources/my-resources');
                  }}>
                    <ListItemIcon>
                      <MenuBookIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">My Resources</Typography>
                  </MenuItem>
                ] : [
                  <MenuItem key="dashboard" onClick={() => handleMenuClick('/dashboard')}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>,
                  <MenuItem key="profile" onClick={() => handleMenuClick('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>,
                  <MenuItem key="settings" onClick={() => handleMenuClick('/settings')}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                ]}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
      </AppBar>
  );
};

export default Navbar;
