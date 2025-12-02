import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
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
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postRequest(endpoints.auth.sendVerificationOtp, { email });
      setDevOtp(response.data.devOtp || '');
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postRequest(endpoints.auth.verifyEmail, { email, otp });
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
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
                Verify Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {otpSent
                  ? 'Enter the verification code sent to your email'
                  : 'Enter your email address to receive a verification code'}
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
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  Email verified successfully! Redirecting to login...
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
            <Box component="form" onSubmit={e => e.preventDefault()}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyPress={e => handleKeyPress(e, otpSent ? handleVerifyEmail : handleSendOTP)}
                  disabled={loading || otpSent || success}
                  autoFocus={!otpSent}
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

                {otpSent && (
                  <TextField
                    fullWidth
                    label="Verification Code"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setOtp(value);
                      }
                    }}
                    onKeyPress={e => handleKeyPress(e, handleVerifyEmail)}
                    disabled={loading || success}
                    autoFocus
                    autoComplete="one-time-code"
                    inputProps={{
                      maxLength: 6,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      style: {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        letterSpacing: '0.5em',
                        fontWeight: 700,
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}

                {otp.length > 0 && otp.length < 6 && otpSent && (
                  <Typography variant="caption" color="text.secondary">
                    {6 - otp.length} digits remaining
                  </Typography>
                )}

                {!otpSent ? (
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
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<CheckCircleIcon />}
                      onClick={handleVerifyEmail}
                      disabled={loading || !otp || otp.length !== 6 || success}
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
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <Button
                      fullWidth
                      variant="text"
                      onClick={handleSendOTP}
                      disabled={loading || success}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      Resend Code
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Already verified?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default VerifyEmail;
