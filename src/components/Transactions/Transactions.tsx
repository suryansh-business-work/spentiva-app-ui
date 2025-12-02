import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Skeleton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expense } from '../../types';
import { endpoints } from '../../config/api';
import { getRequest, putRequest, deleteRequest } from '../../utils/http';
import EditExpenseDialog from '../EditExpenseDialog/EditExpenseDialog';
import './Transactions.scss';

interface TransactionsProps {
  trackerId?: string;
}

const Transactions: React.FC<TransactionsProps> = ({ trackerId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods] = useState<string[]>([
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
  ]);

  useEffect(() => {
    loadExpenses();
    if (trackerId) {
      loadCategories();
    }

    // Listen for expense updates from other components
    const handleExpenseUpdate = () => {
      loadExpenses();
      if (trackerId) {
        loadCategories();
      }
    };

    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    window.addEventListener('categoriesUpdated', handleExpenseUpdate);
    return () => {
      window.removeEventListener('expenseUpdated', handleExpenseUpdate);
      window.removeEventListener('categoriesUpdated', handleExpenseUpdate);
    };
  }, [trackerId]);

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenses, searchTerm, categoryFilter, paymentFilter, sortBy]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.expenses.base, { params: { trackerId } });
      const data = response.data?.expenses || response.data?.data || [];
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setSnackbar({ open: true, message: 'Failed to load expenses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (!trackerId) return;
    try {
      const response = await getRequest(endpoints.categories.categories(trackerId));
      const data = response.data?.categories || response.data?.data || [];
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (id: string, updatedExpense: Partial<Expense>) => {
    try {
      await putRequest(endpoints.expenses.byId(id), updatedExpense);
      await loadExpenses();
      setSnackbar({ open: true, message: 'Expense updated successfully', severity: 'success' });

      // Trigger update in parent (App.tsx) to refresh total
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error updating expense:', error);
      setSnackbar({ open: true, message: 'Failed to update expense', severity: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;

    try {
      await deleteRequest(endpoints.expenses.byId(selectedExpense.id));
      await loadExpenses();
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });

      // Trigger update in parent (App.tsx) to refresh total
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSnackbar({ open: true, message: 'Failed to delete expense', severity: 'error' });
    }
  };

  const filterAndSortExpenses = () => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        expense =>
          expense.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(expense => expense.paymentMethod === paymentFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'date-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterCategories = Array.from(new Set(expenses.map(e => e.category)));
  const filterPaymentMethods = Array.from(new Set(expenses.map(e => e.paymentMethod)));

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#667eea' }}>
          Transaction Logs
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}>
            <TextField
              fullWidth
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>

          <Box sx={{ minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {filterCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment</InputLabel>
              <Select
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                label="Payment"
              >
                <MenuItem value="all">All Payments</MenuItem>
                {filterPaymentMethods.map(method => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: { xs: '100%', sm: '150px', md: '180px' } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="date-desc">Date (Newest)</MenuItem>
                <MenuItem value="date-asc">Date (Oldest)</MenuItem>
                <MenuItem value="amount-desc">Amount (High to Low)</MenuItem>
                <MenuItem value="amount-asc">Amount (Low to High)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: '100%', md: 'auto' } }}>
            <Typography variant="body2" color="text.secondary">
              Total: <strong>{filteredExpenses.length}</strong> transactions
            </Typography>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </Box>
      ) : filteredExpenses.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No transactions found
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredExpenses.map(expense => (
            <Card
              key={expense.id}
              elevation={3}
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Chip
                  label={`₹${expense.amount.toLocaleString('en-IN')}`}
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    minWidth: '100px',
                    height: '40px',
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {expense.subcategory}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={expense.category}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                    <Chip label={expense.paymentMethod} size="small" variant="outlined" />
                    {expense.description && (
                      <Typography variant="caption" color="text.secondary">
                        {expense.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(expense.timestamp)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(expense)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(expense)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Paper elevation={3} sx={{ p: 2, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Total Amount: ₹
          {filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}
        </Typography>
      </Paper>

      <EditExpenseDialog
        open={editDialogOpen}
        expense={selectedExpense}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveEdit}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense of ₹
            {selectedExpense?.amount.toLocaleString('en-IN')}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Transactions;
