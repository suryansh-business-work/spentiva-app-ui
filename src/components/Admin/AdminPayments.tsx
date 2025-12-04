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
  Button,
  useTheme,
  Typography,
} from '@mui/material';
import RefundIcon from '@mui/icons-material/MoneyOff';
import RefundDialog, { type PaymentLog } from './RefundDialog';

// Dummy payment data
const DUMMY_PAYMENTS: PaymentLog[] = [
  {
    id: 'PAY-001',
    userId: 'USER-101',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    plan: 'pro',
    amount: 86.4,
    billingPeriod: 'yearly',
    status: 'success',
    createdAt: '2024-12-01T10:30:00Z',
  },
  {
    id: 'PAY-002',
    userId: 'USER-102',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    plan: 'businesspro',
    amount: 19,
    billingPeriod: 'monthly',
    status: 'success',
    createdAt: '2024-12-02T14:20:00Z',
  },
  {
    id: 'PAY-003',
    userId: 'USER-103',
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    plan: 'pro',
    amount: 9,
    billingPeriod: 'monthly',
    status: 'pending',
    createdAt: '2024-12-03T09:15:00Z',
  },
  {
    id: 'PAY-004',
    userId: 'USER-104',
    userName: 'Alice Williams',
    userEmail: 'alice@example.com',
    plan: 'businesspro',
    amount: 182.4,
    billingPeriod: 'yearly',
    status: 'success',
    createdAt: '2024-11-28T16:45:00Z',
  },
  {
    id: 'PAY-005',
    userId: 'USER-105',
    userName: 'Charlie Brown',
    userEmail: 'charlie@example.com',
    plan: 'pro',
    amount: 86.4,
    billingPeriod: 'yearly',
    status: 'refunded',
    refundedAmount: 86.4,
    createdAt: '2024-11-25T11:00:00Z',
    refundedAt: '2024-11-30T10:00:00Z',
  },
];

const AdminPayments: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [payments, setPayments] = useState<PaymentLog[]>(DUMMY_PAYMENTS);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentLog | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefundClick = (payment: PaymentLog) => {
    setSelectedPayment(payment);
    setRefundDialogOpen(true);
  };

  const handleRefund = (paymentId: string, amount: number, reason: string) => {
    // Mock refund processing
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'refunded' as const,
              refundedAmount: amount,
              refundedAt: new Date().toISOString(),
            }
          : payment
      )
    );
    console.log('Refund processed:', { paymentId, amount, reason });
  };

  const getStatusColor = (status: PaymentLog['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'default';
      default:
        return 'default';
    }
  };

  const paginatedPayments = payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                <strong>Payment ID</strong>
              </TableCell>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Plan</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Billing</strong>
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
            {paginatedPayments.map(payment => (
              <TableRow key={payment.id} hover>
                <TableCell>{payment.id}</TableCell>
                <TableCell>
                  {payment.userName}
                  <Typography variant="caption" display="block" color="text.secondary">
                    {payment.userEmail}
                  </Typography>
                </TableCell>
                <TableCell>{payment.plan.toUpperCase()}</TableCell>
                <TableCell align="right">
                  ${payment.amount.toFixed(2)}
                  {payment.refundedAmount && (
                    <Typography variant="caption" display="block" color="error">
                      -${payment.refundedAmount.toFixed(2)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{payment.billingPeriod === 'yearly' ? 'Annual' : 'Monthly'}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  {payment.status === 'success' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      startIcon={<RefundIcon />}
                      onClick={() => handleRefundClick(payment)}
                    >
                      Refund
                    </Button>
                  )}
                  {payment.status === 'refunded' && (
                    <Typography variant="caption" color="text.secondary">
                      Refunded on {new Date(payment.refundedAt!).toLocaleDateString()}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={payments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <RefundDialog
        open={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        payment={selectedPayment}
        onRefund={handleRefund}
      />
    </Box>
  );
};

export default AdminPayments;
