import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategorySettings from '../CategorySettings/CategorySettings';

const TrackerCategorySettings: React.FC = () => {
  const { trackerId } = useParams<{ trackerId: string }>();
  const navigate = useNavigate();

  if (!trackerId) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={() => navigate(`/tracker/${trackerId}`)} sx={{ color: '#fff' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
          Category Settings
        </Typography>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <CategorySettings trackerId={trackerId} />
      </Container>
    </Box>
  );
};

export default TrackerCategorySettings;
