import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography, Chip } from '@mui/material';

interface Tracker {
  _id: string;
  name: string;
  type: string;
}

interface TrackerSelectorProps {
  trackers: Tracker[];
  selectedTrackerId: string;
  onChange: (trackerId: string) => void;
}

/**
 * TrackerSelector Component
 * Dropdown to select a tracker for detailed view
 */
const TrackerSelector: React.FC<TrackerSelectorProps> = ({
  trackers,
  selectedTrackerId,
  onChange,
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ maxWidth: 400 }}>
      <Select
        id="tracker-select"
        value={selectedTrackerId || ''}
        onChange={handleChange}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            color: !selectedTrackerId ? 'text.secondary' : 'text.primary',
          },
        }}
      >
        <MenuItem value="" disabled>
          <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Select a tracker to view details
          </Typography>
        </MenuItem>
        {trackers.map(tracker => (
          <MenuItem key={tracker._id} value={tracker._id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography>{tracker.name}</Typography>
              <Chip
                label={tracker.type}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7em',
                  textTransform: 'capitalize',
                  bgcolor:
                    tracker.type === 'business'
                      ? 'rgba(102, 126, 234, 0.1)'
                      : 'rgba(16, 185, 129, 0.1)',
                  color: tracker.type === 'business' ? '#667eea' : '#10b981',
                }}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TrackerSelector;
