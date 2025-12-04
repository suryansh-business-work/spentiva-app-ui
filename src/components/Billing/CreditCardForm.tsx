import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, useTheme } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LockIcon from '@mui/icons-material/Lock';

interface CreditCardFormProps {
  onSubmit: () => void;
  disabled?: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSubmit, disabled }) => {
  const theme = useTheme();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const isValidCard = () => {
    const cleanedCard = cardNumber.replace(/\s/g, '');
    return (
      cleanedCard.length === 16 &&
      cardName.trim().length > 0 &&
      expiry.length === 5 &&
      cvv.length === 3
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidCard() && !disabled) {
      onSubmit();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Cardholder Name"
        value={cardName}
        onChange={e => setCardName(e.target.value)}
        required
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CreditCardIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Card Number"
        value={cardNumber}
        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
        required
        placeholder="4242 4242 4242 4242"
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 19 }}
        helperText="Test card: 4242 4242 4242 4242"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Expiry"
          value={expiry}
          onChange={e => setExpiry(formatExpiry(e.target.value))}
          required
          placeholder="MM/YY"
          sx={{ flex: 1 }}
          inputProps={{ maxLength: 5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DateRangeIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="CVV"
          value={cvv}
          onChange={e => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
          required
          placeholder="123"
          type="password"
          sx={{ flex: 1 }}
          inputProps={{ maxLength: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!isValidCard() || disabled}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
          py: 1.5,
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`,
            boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
          },
          '&:disabled': {
            background: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
          },
        }}
      >
        Complete Payment
      </Button>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 2,
          color: theme.palette.text.secondary,
        }}
      >
        🔒 Your payment information is secure
      </Typography>
    </Box>
  );
};

export default CreditCardForm;
