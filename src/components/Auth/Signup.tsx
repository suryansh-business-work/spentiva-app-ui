import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo/Logo';
import axios from 'axios';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const steps = ['Details', 'Phone', 'Verify'];

  const handleNext = () => {
    if (activeStep === 0) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      setError('');
      setActiveStep(1);
    } else if (activeStep === 1) {
      handleSendOTP();
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://api.spentiva.com/api/auth/send-otp', {
        phone,
        type: 'phone',
      });

      setDevOtp(response.data.devOtp);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://api.spentiva.com/api/auth/verify-otp', {
        phone,
        otp,
        name,
        accountType,
      });

      login(response.data.token, response.data.user);
      navigate('/trackers');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setOtp('');
      setDevOtp('');
    }
    setActiveStep((prev) => prev - 1);
    setError('');
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
        background: '#e3f2fd',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={isMobile ? 2 : 8}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: { xs: 1, sm: 1 },
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: { xs: 2, sm: 3 }
              }}
            >
              <Logo width={isMobile ? 160 : 200} height={isMobile ? 45 : 56} />
            </Box>

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: '#667eea',
                  mb: 1
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {activeStep === 0 && 'Enter your details to get started'}
                {activeStep === 1 && 'Enter your phone number'}
                {activeStep === 2 && 'Enter the OTP sent to your phone'}
              </Typography>
            </Box>

            {/* Progress Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: { xs: 3, sm: 4 },
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
              alternativeLabel={isMobile}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Dev OTP Alert */}
            {devOtp && (
              <Fade in>
                <Alert
                  severity="info"
                  sx={{ mb: 3 }}
                  onClose={() => setDevOtp('')}
                >
                  Development OTP: <strong>{devOtp}</strong>
                </Alert>
              </Fade>
            )}

            {/* Step 0: Name & Account Type */}
            {activeStep === 0 && (
              <Slide direction="left" in={activeStep === 0} mountOnEnter unmountOnExit>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <TextField
                    fullWidth
                    label={accountType === 'personal' ? 'Your Name' : 'Business Name'}
                    placeholder={accountType === 'personal' ? 'Enter your full name' : 'Enter business name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleNext)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {accountType === 'personal'
                            ? <PersonIcon sx={{ color: 'text.secondary' }} />
                            : <BusinessIcon sx={{ color: 'text.secondary' }} />
                          }
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    disabled={loading}
                    autoFocus
                    autoComplete="name"
                    inputProps={{
                      'aria-label': accountType === 'personal' ? 'Your Name' : 'Business Name',
                    }}
                  />

                  <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                    <FormLabel
                      component="legend"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        mb: 1
                      }}
                    >
                      Account Type
                    </FormLabel>
                    <RadioGroup
                      row
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as 'personal' | 'business')}
                      sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-start' } }}
                    >
                      <FormControlLabel
                        value="personal"
                        control={<Radio />}
                        label="Personal"
                        disabled={loading}
                        sx={{
                          mr: { xs: 2, sm: 4 },
                          '& .MuiFormControlLabel-label': {
                            fontSize: { xs: '0.875rem', sm: '0.95rem' }
                          }
                        }}
                      />
                      <FormControlLabel
                        value="business"
                        control={<Radio />}
                        label="Business"
                        disabled={loading}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: { xs: '0.875rem', sm: '0.95rem' }
                          }
                        }}
                      />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={loading || !name.trim()}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 1.75 },
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                      }
                    }}
                  >
                    Next
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Already have an account?
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                      sx={{
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          bgcolor: 'rgba(102, 126, 234, 0.04)',
                        }
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
              </Slide>
            )}

            {/* Step 1: Phone Number */}
            {activeStep === 1 && (
              <Slide direction="left" in={activeStep === 1} mountOnEnter unmountOnExit>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setPhone(value);
                      }
                    }}
                    onKeyPress={(e) => handleKeyPress(e, handleNext)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    disabled={loading}
                    autoFocus
                    autoComplete="tel"
                    inputProps={{
                      'aria-label': 'Phone Number',
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 10
                    }}
                    helperText={phone.length > 0 && phone.length < 10 ? `${10 - phone.length} digits remaining` : ''}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={loading || phone.length !== 10}
                    endIcon={loading ? null : <ArrowForwardIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 1.75 },
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mb: 2,
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '0.95rem' },
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        bgcolor: 'rgba(102, 126, 234, 0.04)',
                      }
                    }}
                  >
                    Back
                  </Button>
                </Box>
              </Slide>
            )}

            {/* Step 2: OTP Verification */}
            {activeStep === 2 && (
              <Slide direction="left" in={activeStep === 2} mountOnEnter unmountOnExit>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }}>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setOtp(value);
                      }
                    }}
                    onKeyPress={(e) => handleKeyPress(e, handleVerifyOTP)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    disabled={loading}
                    autoFocus
                    autoComplete="one-time-code"
                    inputProps={{
                      'aria-label': 'One Time Password',
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 6
                    }}
                    helperText={otp.length > 0 && otp.length < 6 ? `${6 - otp.length} digits remaining` : ''}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    endIcon={loading ? null : <ArrowForwardIcon />}
                    sx={{
                      py: { xs: 1.5, sm: 1.75 },
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mb: 2,
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '0.95rem' },
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        bgcolor: 'rgba(102, 126, 234, 0.04)',
                      }
                    }}
                  >
                    Back
                  </Button>
                </Box>
              </Slide>
            )}

            {/* Footer */}
            <Box
              sx={{
                textAlign: 'center',
                mt: { xs: 3, sm: 4 },
                pt: { xs: 2, sm: 3 },
                borderTop: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  display: 'block',
                  mb: 1
                }}
              >
                <Box component="span" sx={{ fontWeight: 500 }}>Spentiva</Box>
                {' '}
                <Box component="span" sx={{ opacity: 0.7 }}>By Exyconn</Box>
                {' • '}
                <Box
                  component="span"
                  onClick={() => navigate('/privacy-policy')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#667eea',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Privacy Policy
                </Box>
                {' • '}
                <Box
                  component="span"
                  onClick={() => navigate('/terms-and-conditions')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#667eea',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Terms & Conditions
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Signup;
