import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
  ListItemIcon,
  ListItemText,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShieldIcon from '@mui/icons-material/Shield';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { logout, user } = useAuth();

  const drawerItems = [
    { text: 'Usage', icon: <ShowChartIcon />, path: '/usage' },
    { text: 'Billing & Subscription', icon: <CreditCardIcon />, path: '/billing' },
    { text: 'Privacy & Policy', icon: <ShieldIcon />, path: '/policy' },
  ];

  // Add admin panel for admin users
  if (user?.role === 'admin') {
    drawerItems.unshift({
      text: 'Admin Panel',
      icon: <AdminPanelSettingsIcon />,
      path: '/admin',
    });
  }

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', height: 64, px: 2, gap: 1.5 }}>
          <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/trackers')}>
            <Logo width={100} height={28} />
          </Box>

          {/* Dark/Light Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
              },
            }}
          >
            {isDarkMode ? (
              <LightModeIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            )}
          </IconButton>

          {/* Trackers Button */}
          <Button
            startIcon={<FolderIcon />}
            size="small"
            onClick={() => navigate('/trackers')}
            sx={{
              color:
                location.pathname === '/trackers'
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              minHeight: 32,
              borderRadius: 1,
              fontSize: '0.875rem',
              background:
                location.pathname === '/trackers' ? theme.palette.primary.main : 'transparent',
              '&:hover': {
                background:
                  location.pathname === '/trackers'
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
              },
            }}
          >
            Trackers
          </Button>

          {/* User Avatar - Opens Drawer */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{ p: 0.25, border: `1.5px solid ${theme.palette.divider}` }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                background: theme.palette.primary.main,
                fontSize: '0.8rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Unified Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 },
            background: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Profile Section */}
          <Box
            onClick={() => {
              navigate('/profile');
              setDrawerOpen(false);
            }}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                background: theme.palette.action.hover,
              },
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: theme.palette.primary.main,
                fontSize: '1.5rem',
                border: `2px solid ${theme.palette.divider}`,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.primary.main, fontWeight: 500, fontSize: '0.75rem' }}
              >
                View Profile
              </Typography>
            </Box>
          </Box>

          {/* Menu Items */}
          <List sx={{ flexGrow: 1, py: 1 }}>
            {drawerItems.map(item => (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Logout Button */}
          <Box sx={{ p: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                border: `1px solid ${theme.palette.error.main}`,
                color: theme.palette.error.main,
                py: 1.25,
                '&:hover': {
                  background: `${theme.palette.error.main}10`,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
