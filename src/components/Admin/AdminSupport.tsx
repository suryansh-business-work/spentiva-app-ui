import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SupportTicket, TicketStatus, TicketType } from '../../types/support';
import { getUserTickets } from '../../services/supportService';
import AdminSupportDialog from './AdminSupportDialog';

const getStatusColor = (status: TicketStatus): 'default' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'Open':
      return 'warning';
    case 'InProgress':
      return 'default';
    case 'Closed':
      return 'success';
    case 'Escalated':
      return 'error';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    PaymentRelated: 'Payment',
    BugInApp: 'Bug',
    DataLoss: 'Data Loss',
    FeatureRequest: 'Feature',
    Other: 'Other',
  };
  return labels[type] || type;
};

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'All'>('All');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'All') filters.status = statusFilter;
      if (typeFilter !== 'All') filters.type = typeFilter;

      const response = await getUserTickets(filters);
      setTickets(response.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, typeFilter]);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleUpdate = () => {
    fetchTickets();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Support Tickets
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value as TicketStatus | 'All')}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={e => setTypeFilter(e.target.value as TicketType | 'All')}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="PaymentRelated">Payment</MenuItem>
            <MenuItem value="BugInApp">Bug</MenuItem>
            <MenuItem value="DataLoss">Data Loss</MenuItem>
            <MenuItem value="FeatureRequest">Feature</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Tickets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No tickets found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map(ticket => (
                <TableRow key={ticket._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {ticket.ticketId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.user?.name || 'Unknown'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(ticket.type)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      size="small"
                      color={getStatusColor(ticket.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleViewTicket(ticket)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <AdminSupportDialog
        open={dialogOpen}
        ticket={selectedTicket}
        onClose={handleCloseDialog}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default AdminSupport;
