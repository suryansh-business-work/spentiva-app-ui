import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  useTheme,
  Typography,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SupportDetailDialog from './SupportDetailDialog';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'payment' | 'bug' | 'dataloss' | 'other';
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed' | 'escalated';
  createdAt: string;
}

// Dummy support ticket data
const DUMMY_TICKETS: SupportTicket[] = [
  {
    id: 'TICKET-001',
    userId: 'USER-101',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    type: 'payment',
    subject: 'Payment not processed',
    message: 'I tried to upgrade to Pro plan but my payment failed...',
    status: 'open',
    createdAt: '2024-12-04T09:30:00Z',
  },
  {
    id: 'TICKET-002',
    userId: 'USER-102',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    type: 'bug',
    subject: 'Dashboard not loading',
    message: 'When I click on the dashboard, it shows a blank screen...',
    status: 'in-progress',
    createdAt: '2024-12-03T14:20:00Z',
  },
  {
    id: 'TICKET-003',
    userId: 'USER-103',
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    type: 'dataloss',
    subject: 'Lost all my expense data',
    message: 'All my expense tracking data disappeared after login...',
    status: 'open',
    createdAt: '2024-12-02T11:45:00Z',
  },
  {
    id: 'TICKET-004',
    userId: 'USER-104',
    userName: 'Alice Williams',
    userEmail: 'alice@example.com',
    type: 'other',
    subject: 'Feature request: Export to CSV',
    message: 'It would be great to export my expenses to CSV format...',
    status: 'closed',
    createdAt: '2024-11-30T16:00:00Z',
  },
  {
    id: 'TICKET-005',
    userId: 'USER-105',
    userName: 'Charlie Brown',
    userEmail: 'charlie@example.com',
    type: 'payment',
    subject: 'Refund request',
    message: 'I would like to request a refund for my annual subscription...',
    status: 'escalated',
    createdAt: '2024-11-28T10:15:00Z',
  },
];

const AdminSupport: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(DUMMY_TICKETS);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'closed':
        return 'success';
      case 'escalated':
        return 'error'; // Dark red for urgent attention
      default:
        return 'default';
    }
  };

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

  const paginatedTickets = tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDetailDialogOpen(true);
  };

  const handleStatusUpdate = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    console.log('Status updated:', { ticketId, newStatus });
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: `1px solid ${theme.palette.divider}` }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <TableRow>
              <TableCell>
                <strong>Ticket ID</strong>
              </TableCell>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Subject</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTickets.map(ticket => (
              <TableRow
                key={ticket.id}
                hover
                sx={{
                  ...(ticket.status === 'escalated' && {
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(211, 47, 47, 0.15)'
                            : 'rgba(211, 47, 47, 0.08)',
                      },
                      '50%': {
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(211, 47, 47, 0.25)'
                            : 'rgba(211, 47, 47, 0.15)',
                      },
                    },
                  }),
                }}
              >
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  {ticket.userName}
                  <Typography variant="caption" display="block" color="text.secondary">
                    {ticket.userEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={getTypeLabel(ticket.type)} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {ticket.subject}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: 250, display: 'block' }}
                  >
                    {ticket.message}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status.replace('-', ' ')}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewTicket(ticket)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={tickets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <SupportDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        ticket={selectedTicket}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default AdminSupport;
