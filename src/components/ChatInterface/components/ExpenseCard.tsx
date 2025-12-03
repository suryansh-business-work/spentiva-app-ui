import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Expense } from '../../../types/expense';

/**
 * Props for ExpenseCard component
 */
interface ExpenseCardProps {
  expense: Expense;
}

/**
 * ExpenseCard Component
 * Displays expense details in a card format
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  return (
    <Card sx={{ mt: 2, backgroundColor: 'rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Amount */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Amount:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              ₹{expense.amount}
            </Typography>
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Category:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {expense.subcategory}
            </Typography>
          </Box>

          {/* Payment Method */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Payment:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {expense.paymentMethod}
            </Typography>
          </Box>

          {/* Description (if available) */}
          {expense.description && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Description:
              </Typography>
              <Typography variant="body2">{expense.description}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
