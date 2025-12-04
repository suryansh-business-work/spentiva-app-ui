import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  useTheme,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type SupportTicket } from './AdminSupport';

interface SupportDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onStatusUpdate?: (ticketId: string, newStatus: SupportTicket['status']) => void;
}

const SupportDetailDialog: React.FC<SupportDetailDialogProps> = ({
  open,
  onClose,
  ticket,
  onStatusUpdate,
}) => {
  const theme = useTheme();
  const [status, setStatus] = useState<SupportTicket['status']>('open');

  // Update status when ticket changes
  React.useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
    }
  }, [ticket]);

  if (!ticket) return null;

  const getTypeLabel = (type: SupportTicket['type']) => {
    switch (type) {
      case 'payment':
        return 'Payment Related';
      case 'bug':
        return 'Bug In App';
      case 'dataloss':
        return 'Data Loss';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value as SupportTicket['status'];
    setStatus(newStatus);
  };

  const handleUpdateStatus = () => {
    if (onStatusUpdate && status !== ticket.status) {
      onStatusUpdate(ticket.id, status);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          fontWeight: 700,
        }}
      >
        Ticket Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Ticket ID and Type */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>
            {ticket.id}
          </Typography>
          <Chip label={getTypeLabel(ticket.type)} variant="outlined" />
        </Stack>

        {/* Status Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="ticket-status-label">Ticket Status</InputLabel>
          <Select
            labelId="ticket-status-label"
            id="ticket-status"
            value={status}
            label="Ticket Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="open">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Open" color="error" size="small" />
              </Box>
            </MenuItem>
            <MenuItem value="in-progress">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="In Progress" color="warning" size="small" />
              </Box>
            </MenuItem>
            <MenuItem value="closed">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Closed" color="success" size="small" />
              </Box>
            </MenuItem>
            <MenuItem value="escalated">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Escalated" color="info" size="small" />
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* User Information */}
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
            User Information
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {ticket.userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ticket.userEmail}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            User ID: {ticket.userId}
          </Typography>
        </Box>

        {/* Subject */}
        <Box mb={3}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Subject
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {ticket.subject}
          </Typography>
        </Box>

        {/* Message */}
        <Box mb={3}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Message
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.message}
            </Typography>
          </Box>
        </Box>

        {/* Timestamp */}
        <Typography variant="caption" color="text.secondary">
          Submitted on {new Date(ticket.createdAt).toLocaleString()}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateStatus}
          disabled={status === ticket.status}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupportDetailDialog;
