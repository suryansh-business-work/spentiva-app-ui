import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  useTheme,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { type PlanType } from '../../config/planConfig';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  currentPlan: PlanType;
}

type SupportType = 'payment' | 'bug' | 'dataloss' | 'other';

const SUPPORT_TYPES: Record<SupportType, string> = {
  payment: 'Payment Related',
  bug: 'Bug In App',
  dataloss: 'Data Loss',
  other: 'Other',
};

const SupportDialog: React.FC<SupportDialogProps> = ({
  open,
  onClose,
  userName,
  userEmail,
  currentPlan,
}) => {
  const theme = useTheme();
  const [supportType, setSupportType] = useState<SupportType>('other');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const emailSubject = encodeURIComponent(
      `[${SUPPORT_TYPES[supportType]}] ${subject || 'Support Request'}`
    );
    const emailBody = encodeURIComponent(
      `Name: ${userName}\nEmail: ${userEmail}\nCurrent Plan: ${currentPlan.toUpperCase()}\n\nSupport Type: ${SUPPORT_TYPES[supportType]}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:support@spentiva.com?subject=${emailSubject}&body=${emailBody}`;

    // Reset form and close
    handleClose();
  };

  const handleClose = () => {
    setSupportType('other');
    setSubject('');
    setMessage('');
    onClose();
  };

  const isFormValid = subject.trim() !== '' && message.trim() !== '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          fontWeight: 700,
          fontSize: '1.25rem',
        }}
      >
        Contact Support
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Business Hours Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            Business Hours
          </Typography>
          <Typography variant="caption">
            Our support team is available Monday - Friday, 9:00 AM - 6:00 PM IST. We typically
            respond within 24 business hours.
          </Typography>
        </Alert>

        {/* Pre-filled User Info */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Your Information
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
            {userEmail}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Current Plan:{' '}
            <Typography component="span" fontWeight={600} color="primary">
              {currentPlan.toUpperCase()}
            </Typography>
          </Typography>
        </Box>

        {/* Support Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="support-type-label">Support Type</InputLabel>
          <Select
            labelId="support-type-label"
            value={supportType}
            label="Support Type"
            onChange={e => setSupportType(e.target.value as SupportType)}
          >
            {Object.entries(SUPPORT_TYPES).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subject Field */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          sx={{ mb: 2 }}
          required
          placeholder="Brief description of your issue"
        />

        {/* Message Field */}
        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          multiline
          rows={6}
          required
          placeholder="Please provide detailed information about your query..."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          endIcon={<SendIcon />}
          sx={{ minWidth: 100 }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupportDialog;
