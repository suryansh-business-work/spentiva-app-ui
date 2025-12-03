import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { TrackerStats } from '../../../types/usage';

interface TrackerStatsPanelProps {
  data: TrackerStats | null;
  loading: boolean;
  error: string | null;
}

/**
 * TrackerStatsPanel Component
 * Displays detailed statistics for a specific tracker
 */
const TrackerStatsPanel: React.FC<TrackerStatsPanelProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="info">Select a tracker to view detailed statistics.</Alert>;
  }

  const stats = [
    {
      label: 'Total Messages',
      value: data.usage.totalMessages,
      color: '#667eea',
    },
    {
      label: 'Total Tokens',
      value: data.usage.totalTokens.toLocaleString(),
      color: '#10b981',
    },
    {
      label: 'User Messages',
      value: data.usage.userMessages,
      color: '#3b82f6',
    },
    {
      label: 'AI Messages',
      value: data.usage.aiMessages,
      color: '#f59e0b',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {data.tracker.trackerName} - Detailed Usage
        </Typography>
        {data.tracker.isDeleted && (
          <Chip label="Deleted Tracker" color="error" size="small" />
        )}
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map(({ label, value, color }) => (
          <Grid size={{ xs: 6, md: 3 }} key={label}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1, fontSize: '0.85em' }}
              >
                {label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color }}>
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Messages */}
      {data.messages && data.messages.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Messages ({data.messages.length})
          </Typography>
          <Stack spacing={2} divider={<Divider />}>
            {data.messages.slice(0, 5).map((msg, idx) => (
              <Box key={msg._id || idx}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Chip
                    label={msg.role}
                    size="small"
                    color={msg.role === 'user' ? 'primary' : 'secondary'}
                    sx={{ fontSize: '0.75em' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {msg.tokenCount} tokens
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {msg.content.substring(0, 150)}
                  {msg.content.length > 150 && '...'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default TrackerStatsPanel;
