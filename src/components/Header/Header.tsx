import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { logout, user } = useAuth();

  const menuItems = [
    { text: 'Trackers', icon: <FolderIcon />, path: '/trackers' },
    { text: 'Usage', icon: <ShowChartIcon />, path: '/usage' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
    setProfileMenuAnchor(null);
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
        <Toolbar sx={{ minHeight: 48, px: { xs: 1.5, sm: 2 }, gap: 1.5 }}>
          <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/trackers')}>
            <Logo width={100} height={28} />
          </Box>

          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              borderRadius: 1,
              p: 0.5,
              '&:hover': { color: theme.palette.text.primary },
            }}
          >
            {isDarkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>

          {!isMobile && (
            <>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  size="small"
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.5,
                    minHeight: 32,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    background: location.pathname === item.path
                      ? theme.palette.primary.main
                      : 'transparent',
                    '&:hover': {
                      background: location.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.action.hover,
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <IconButton
                onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
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
            </>
          )}

          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: theme.palette.text.secondary }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 1,
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

          <Divider sx={{ my: 2 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.error.main,
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          sx: {
            minWidth: 160,
            borderRadius: 1,
            mt: 1,
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); setProfileMenuAnchor(null); }}>
          <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.error.main }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
