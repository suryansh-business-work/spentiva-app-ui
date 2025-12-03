import React from 'react';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TransactionsFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  paymentFilter: string;
  sortBy: string;
  filteredExpensesCount: number;
  filterCategories: string[];
  filterPaymentMethods: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPaymentChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

/**
 * TransactionsFilters Component
 * Renders search bar and filter controls for transactions
 */
const TransactionsFilters: React.FC<TransactionsFiltersProps> = ({
  searchTerm,
  categoryFilter,
  paymentFilter,
  sortBy,
  filteredExpensesCount,
  filterCategories,
  filterPaymentMethods,
  onSearchChange,
  onCategoryChange,
  onPaymentChange,
  onSortChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
      <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}>
        <TextField
          fullWidth
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
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
            onChange={e => onCategoryChange(e.target.value)}
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
            onChange={e => onPaymentChange(e.target.value)}
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
          <Select value={sortBy} onChange={e => onSortChange(e.target.value)} label="Sort By">
            <MenuItem value="date-desc">Date (Newest)</MenuItem>
            <MenuItem value="date-asc">Date (Oldest)</MenuItem>
            <MenuItem value="amount-desc">Amount (High to Low)</MenuItem>
            <MenuItem value="amount-asc">Amount (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: '100%', md: 'auto' } }}>
        <Typography variant="body2" color="text.secondary">
          Total: <strong>{filteredExpensesCount}</strong> transactions
        </Typography>
      </Box>
    </Box>
  );
};

export default TransactionsFilters;
