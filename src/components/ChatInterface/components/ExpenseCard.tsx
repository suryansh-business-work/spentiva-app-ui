import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Expense } from '../../../types/expense';

/**
 * Props for ExpenseCard component
 */
interface ExpenseCardProps {
  expense: Expense;
}

/**
 * ExpenseCard Component
 * Displays expense details in a compact card format
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        mt: 1.5,
        backgroundColor:
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {/* Amount */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Amount:
            </Typography>
            <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
              ₹{expense.amount}
            </Typography>
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Category:
            </Typography>
            <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
              {expense.subcategory}
            </Typography>
          </Box>

          {/* Payment Method */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Payment:
            </Typography>
            <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
              {expense.paymentMethod}
            </Typography>
          </Box>

          {/* Description (if available) */}
          {expense.description && (
            <Box sx={{ mt: 0.5, pt: 0.75, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}
              >
                Description:
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                {expense.description}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
