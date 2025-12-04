import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';

interface AdminSidebarProps {
  activeSection: 'dashboard' | 'users';
  onSectionChange: (section: 'dashboard' | 'users') => void;
  isMobile?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobile = false,
}) => {
  const theme = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'users', label: 'User Management', icon: <PeopleIcon /> },
  ];

  return (
    <Box sx={{ width: isMobile ? '100%' : 240, py: 2 }}>
      <List>
        {menuItems.map(item => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => onSectionChange(item.id as 'dashboard' | 'users')}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
              },
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: activeSection === item.id ? '#fff' : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: activeSection === item.id ? 700 : 500,
                fontSize: '0.875rem',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default AdminSidebar;
