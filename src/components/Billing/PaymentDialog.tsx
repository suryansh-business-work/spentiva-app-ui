import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Lottie from 'lottie-react';
import CreditCardForm from './CreditCardForm';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentAnim, setPaymentAnim] = useState<any>(null);
  const [successAnim, setSuccessAnim] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/payment_animation.json')
      .then(res => res.json())
      .then(data => setPaymentAnim(data))
      .catch(err => console.error('Error loading payment animation:', err));

    fetch('/animations/payment_successful.json')
      .then(res => res.json())
      .then(data => setSuccessAnim(data))
      .catch(err => console.error('Error loading success animation:', err));
  }, []);

  const handlePaymentSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    }, 2000);
  };

  const handleClose = () => {
    if (!processing && !success) {
      onClose();
    }
  };

  if (success && successAnim) {
    return (
      <Dialog
        open={open}
        maxWidth={false}
        PaperProps={{ sx: { width: isMobile ? '90%' : '50%', maxWidth: 600, borderRadius: 3 } }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Lottie
            animationData={successAnim}
            loop={false}
            style={{ width: 200, height: 200, margin: '0 auto' }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: theme.palette.success.main, mt: 2 }}
          >
            Payment Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Welcome to Pro! 🎉
          </Typography>
        </Box>
      </Dialog>
    );
  }

  if (processing && paymentAnim) {
    return (
      <Dialog
        open={open}
        maxWidth={false}
        PaperProps={{ sx: { width: isMobile ? '90%' : '50%', maxWidth: 600, borderRadius: 3 } }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Lottie
            animationData={paymentAnim}
            loop={true}
            style={{ width: 300, height: 300, margin: '0 auto' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
            Processing Payment...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{ sx: { width: isMobile ? '90%' : '50%', maxWidth: 600, borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Upgrade to Pro
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 100%)`,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.contrastText }}
          >
            Pro Plan - Annual
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              'Unlimited trackers',
              'Unlimited tracking',
              'Advanced analytics',
              'AI insights',
              'Priority support',
            ].map(f => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.primary.contrastText }} />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.primary.contrastText, opacity: 0.95 }}
                >
                  {f}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
              Total
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: theme.palette.primary.contrastText }}
            >
              $99
            </Typography>
          </Box>
        </Box>
        <CreditCardForm onSubmit={handlePaymentSubmit} disabled={processing} />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
