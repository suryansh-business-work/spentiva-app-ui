import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Fade,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { api } from '../../config/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.auth.forgotPassword(email);
      setDevOtp(response.devOtp || '');
      setSuccess(true);

      // Redirect to reset password after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendOTP();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Fade in={true} timeout={600}>
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img
                src="https://spentiva.com/logo.svg"
                alt="Spentiva Logo"
                style={{ height: 48, marginBottom: 24 }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No worries! Enter your email and we'll send you a reset code.
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  onClose={() => setError('')}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Success Alert */}
            {success && (
              <Fade in={true}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  OTP sent successfully! Redirecting to reset password...
                </Alert>
              </Fade>
            )}

            {/* Dev OTP Alert */}
            {devOtp && (
              <Fade in={true}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    Development OTP: <strong>{devOtp}</strong>
                  </Typography>
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || success}
                  autoFocus
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleSendOTP}
                  disabled={loading || !email || success}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/login')}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default ForgotPassword;
