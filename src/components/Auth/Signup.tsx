import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Fade,
  Skeleton,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../config/api';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['user', 'business', 'individual'], 'Invalid account type')
    .required('Account type is required'),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        const response = await api.auth.signup({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role as 'user' | 'business' | 'individual',
        });

        // Save user information to localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Update auth context
        login(response.token, response.user);

        // Redirect to trackers page
        navigate('/trackers');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        background: '#ffffff',
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Left Side - Form */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: '0 0 480px', lg: '0 0 550px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          background: '#ffffff',
          overflowY: 'auto',
          height: '100%',
          position: 'relative',
          zIndex: 10,
          boxShadow: { md: '4px 0 24px rgba(0,0,0,0.05)' },
        }}
      >
        <Fade in={true} timeout={600}>
          <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', py: 4 }}>
            {/* Logo */}
            <Box sx={{ mb: 4 }}>
              <img
                src="https://spentiva.com/logo.svg"
                alt="Spentiva Logo"
                style={{ height: 40 }}
              />
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 1,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                }}
              >
                Create an account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              >
                Start managing your expenses today.
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  onClose={() => setError('')}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    alignItems: 'center',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Name Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'inherit',
                      }}
                    >
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      disabled={loading}
                      autoFocus
                      autoComplete="name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#F9FAFB',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#D1D5DB',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: 1,
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Email Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'inherit',
                      }}
                    >
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      disabled={loading}
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#F9FAFB',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#D1D5DB',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: 1,
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Account Type Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'inherit',
                      }}
                    >
                      Account Type
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="role"
                      name="role"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.role && Boolean(formik.errors.role)}
                      helperText={formik.touched.role && formik.errors.role}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#F9FAFB',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#D1D5DB',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: 1,
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                        },
                      }}
                    >
                      <MenuItem value="user">Personal</MenuItem>
                      <MenuItem value="business">Business</MenuItem>
                      <MenuItem value="individual">Individual</MenuItem>
                    </TextField>
                  </Box>
                )}

                {/* Password Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'inherit',
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      disabled={loading}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              disabled={loading}
                              size="small"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#F9FAFB',
                          '& fieldset': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover fieldset': {
                            borderColor: '#D1D5DB',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: 1,
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Submit Button */}
                {loading ? (
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading || !formik.isValid}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      bgcolor: '#4CAF50',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#43A047',
                        boxShadow: 'none',
                      },
                      '&:active': {
                        bgcolor: '#388E3C',
                      },
                      '&:disabled': {
                        bgcolor: '#E5E7EB',
                        color: '#9CA3AF',
                      },
                    }}
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: 'inherit' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#4CAF50',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    '&:hover': {
                      color: '#388E3C',
                    },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Right Side - Image */}
      <Box
        sx={{
          flex: '1 1 auto',
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
            },
          }}
        />

        {/* Overlay Content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 8,
            zIndex: 2,
            color: 'white',
          }}
        >
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Start your journey with us.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                  fontFamily: 'inherit',
                  maxWidth: '600px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                Create an account to access powerful tools and insights for your financial growth.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
