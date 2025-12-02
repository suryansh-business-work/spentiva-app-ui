import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Alert,
  Collapse,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FolderIcon from "@mui/icons-material/Folder";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useThemeMode } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const theme = muiTheme; // Use MUI theme for all theming
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { logout, user } = useAuth();
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Check if email verification message should be shown
  React.useEffect(() => {
    const shouldShow = localStorage.getItem('showEmailVerification') === 'true';
    const isEmailVerified = user?.emailVerified;

    if (shouldShow && !isEmailVerified) {
      setShowEmailVerification(true);
    }
  }, [user]);

  const handleDismissVerification = () => {
    setShowEmailVerification(false);
    localStorage.removeItem('showEmailVerification');
  };

  // Check if user is in a tracker view
  const isInTrackerView = location.pathname.startsWith("/tracker/");

  const menuItems = [
    { text: "Trackers", icon: <FolderIcon />, path: "/trackers" },
    { text: "Usage", icon: <ShowChartIcon />, path: "/usage" },
    { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfileMenuAnchor(null);
  };

  const getPhotoUrl = () => {
    if (user?.profilePhoto) {
      return user.profilePhoto.startsWith('http')
        ? user.profilePhoto
        : `https://api.spentiva.com${user.profilePhoto}`;
    }
    return '';
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
          transition: 'all 0.3s ease',
          borderRadius: 0
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 60 }, px: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexGrow: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate("/trackers")}
          >
            <Logo width={140} height={40} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                background: theme.palette.action.hover,
                transition: 'all 0.2s ease',
                "&:hover": {
                  background: theme.palette.action.selected,
                  color: theme.palette.text.primary,
                  transform: 'scale(1.05)',
                },
              }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            {isMobile ? (
              <IconButton
                edge="end"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  ml: 0.5,
                  color: theme.palette.text.secondary,
                  background: theme.palette.action.hover,
                  transition: 'all 0.2s ease',
                  "&:hover": {
                    background: theme.palette.action.selected,
                    color: theme.palette.text.primary,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 1, ml: 1, alignItems: "center" }}>
                <Button
                  startIcon={<FolderIcon fontSize="small" />}
                  size="small"
                  onClick={() => navigate("/trackers")}
                  sx={{
                    color: location.pathname === "/trackers" || isInTrackerView
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875em",
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    background: location.pathname === "/trackers" || isInTrackerView
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                    "&:hover": {
                      background: location.pathname === "/trackers" || isInTrackerView
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                    },
                  }}
                >
                  Trackers
                </Button>
                <Button
                  startIcon={<ShowChartIcon fontSize="small" />}
                  size="small"
                  onClick={() => navigate("/usage")}
                  sx={{
                    color: location.pathname === "/usage"
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875em",
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    background: location.pathname === "/usage"
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                    "&:hover": {
                      background: location.pathname === "/usage"
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                    },
                  }}
                >
                  Usage
                </Button>
                <Chip
                  label={localStorage.getItem('subscription_plan') || 'Free'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75em",
                    height: 24,
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 1.5,
                  }}
                />
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{
                    ml: 0.5,
                    p: 0.25,
                    border: `2px solid ${location.pathname === "/profile" ? theme.palette.primary.main : theme.palette.divider}`,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Avatar
                    src={getPhotoUrl()}
                    sx={{
                      width: 32,
                      height: 32,
                      background: theme.palette.primary.main,
                      fontSize: "0.875em",
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Email Verification Banner */}
      <Collapse in={showEmailVerification}>
        <Alert
          severity="warning"
          icon={<MailOutlineIcon />}
          onClose={handleDismissVerification}
          sx={{
            borderRadius: 0,
            borderBottom: '1px solid rgba(237, 108, 2, 0.3)',
            backgroundColor: '#fff3cd',
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              User not verified yet. Please verify - check your email.
            </Typography>
            <Button
              size="small"
              onClick={() => navigate('/profile')}
              sx={{
                ml: 2,
                textTransform: 'none',
                fontWeight: 600,
                color: '#ed6c02',
                '&:hover': {
                  backgroundColor: 'rgba(237, 108, 2, 0.08)',
                },
              }}
            >
              Verify Now
            </Button>
          </Box>
        </Alert>
      </Collapse>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: `-4px 0 20px ${theme.shadows[3]}`,
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: theme.palette.primary.main,
                  boxShadow: `0 4px 12px ${theme.shadows[3]}`,
                }}
              >
                <AccountBalanceWalletIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1.1em", color: theme.palette.text.primary }}>
                  Expense Tracker
                </Typography>
                <Chip
                  label="Premium"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7em",
                    fontWeight: 600,
                    background: theme.palette.success.light,
                    color: theme.palette.primary.main,
                    mt: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
              </Box>
            </Box>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  background: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: theme.palette.divider }} />

          <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.5,
                    "&.Mui-selected": {
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 4px 12px ${theme.shadows[3]}`,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.contrastText,
                      },
                      "&:hover": {
                        background: theme.palette.primary.main,
                      },
                    },
                    "&:hover": {
                      background: theme.palette.action.hover,
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: "0.95em",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: theme.palette.divider }} />

          <Box sx={{ p: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2.5,
                py: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.action.hover,
                "&:hover": {
                  background: theme.palette.error.light,
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.error.main,
                  },
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.95em",
                  color: theme.palette.error.main,
                }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 180,
            borderRadius: 2.5,
            mt: 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875em' }}>
            {user?.name}
          </Typography>
        </Box>
        <MenuItem
          onClick={handleProfileClick}
          sx={{
            py: 1.25,
            px: 2,
            '&:hover': {
              background: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AccountCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText
            primary="My Profile"
            primaryTypographyProps={{
              fontSize: '0.875em',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          />
        </MenuItem >
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.25,
            px: 2,
            '&:hover': {
              background: theme.palette.error.light,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.875em',
              fontWeight: 600,
              color: theme.palette.error.main,
            }}
          />
        </MenuItem>
      </Menu >
    </>
  );
};

export default Header;
