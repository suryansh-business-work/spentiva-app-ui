import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { TrackerFormData } from '../types/tracker.types';

interface CreateEditDialogProps {
  open: boolean;
  editMode: boolean;
  formData: TrackerFormData;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof TrackerFormData, value: any) => void;
  disabled?: boolean;
}

const CreateEditDialog: React.FC<CreateEditDialogProps> = ({
  open,
  editMode,
  formData,
  onClose,
  onSave,
  onChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: fullScreen ? 0 : 3,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary }}>
        {editMode ? 'Edit Tracker' : 'Create New Tracker'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Tracker Name"
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="e.g., Home Expenses, Business Travel"
            required
            disabled={disabled}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: theme.palette.background.paper,
              },
            }}
          />

          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Tracker Type</InputLabel>
            <Select
              value={formData.type}
              onChange={e => onChange('type', e.target.value)}
              label="Tracker Type"
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="personal">Personal Use</MenuItem>
              <MenuItem value="business">Business Use</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={3}
            value={formData.description}
            onChange={e => onChange('description', e.target.value)}
            placeholder="Brief description of this tracker"
            disabled={disabled}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: theme.palette.background.paper,
              },
            }}
          />

          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              onChange={e => onChange('currency', e.target.value)}
              label="Currency"
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="INR">INR (₹)</MenuItem>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={disabled} sx={{ color: theme.palette.text.secondary }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.name || !formData.type || !formData.currency || disabled}
          startIcon={disabled ? <CircularProgress size={20} color="inherit" /> : undefined}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          {disabled ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditDialog;
