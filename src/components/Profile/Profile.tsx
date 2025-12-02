import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Grow,
  Chip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../contexts/AuthContext';
import { api, API_BASE } from '../../config/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Profile: React.FC = () => {
  const { user, updateUser, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        const response: any = await api.auth.updateProfile(
          { name: values.name },
          token!
        );

        // The API returns nested data structure: { message, data: { message, user } }
        // We need to handle this correctly based on the actual response
        const updatedUser = response.data?.user || response.user;

        if (updatedUser) {
          updateUser(updatedUser);
          setMessage('Profile updated successfully');
          setIsEditing(false);
        } else {
          // Fallback if user object isn't directly available but operation succeeded
          setMessage('Profile updated successfully');
          setIsEditing(false);
          // Optionally reload user data
          const userResponse = await api.auth.getCurrentUser(token!);
          if (userResponse.user) {
            updateUser(userResponse.user);
          }
        }
      } catch (err: any) {
        console.error('Profile update error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      // Show preview immediately
      setPhotoPreview(URL.createObjectURL(file));

      // Auto upload
      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response: any = await api.auth.uploadProfilePhoto(file, token!);

      if (user) {
        const newPhotoUrl = response.data?.photoUrl || response.photoUrl;

        if (newPhotoUrl) {
          updateUser({
            ...user,
            profilePhoto: newPhotoUrl,
          });
          setMessage('Profile photo updated successfully');
        } else {
          // Fallback reload
          const userResponse = await api.auth.getCurrentUser(token!);
          if (userResponse.user) {
            updateUser(userResponse.user);
          }
          setMessage('Profile photo updated successfully');
        }
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload photo');
      // Revert preview on error
      setPhotoPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = () => {
    if (photoPreview) return photoPreview;
    if (user?.profilePhoto) {
      if (user.profilePhoto.startsWith('http')) {
        return user.profilePhoto;
      }
      return `${API_BASE}${user.profilePhoto}`;
    }
    return undefined;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f9fafb', py: 4, fontFamily: '"Inter", sans-serif' }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={500}>
          <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                My Profile
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Manage your personal information and account settings
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 3 }}>
              {/* Left Card - Profile Photo */}
              <Grow in={true} timeout={600}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                    overflow: 'visible',
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            right: -6,
                            bottom: -6,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            opacity: 0.15,
                          },
                        }}
                      >
                        <Avatar
                          src={getPhotoUrl()}
                          sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid #fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '3em',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            opacity: loading ? 0.5 : 1,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        {/* Loading Overlay */}
                        {loading && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.5)',
                              zIndex: 10,
                            }}
                          >
                            <CircularProgress size={40} sx={{ color: '#16a34a' }} />
                          </Box>
                        )}
                      </Box>
                      <IconButton
                        component="label"
                        disabled={loading}
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          background: '#16a34a',
                          color: 'white',
                          width: 36,
                          height: 36,
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)',
                          '&:hover': {
                            background: '#15803d',
                            transform: 'scale(1.1)',
                          },
                          '&.Mui-disabled': {
                            background: '#E5E7EB',
                            color: '#9CA3AF',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <PhotoCameraIcon fontSize="small" />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#111827' }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                      {user?.email}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: user?.accountType === 'business'
                              ? 'rgba(37, 99, 235, 0.1)'
                              : 'rgba(22, 163, 74, 0.1)',
                          }}
                        >
                          {user?.accountType === 'business' ? (
                            <BusinessIcon sx={{ color: '#2563eb' }} />
                          ) : (
                            <PersonIcon sx={{ color: '#16a34a' }} />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontWeight: 500 }}>
                            Account Type
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                            {user?.accountType || 'Personal'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Right Card - Profile Details */}
              <Grow in={true} timeout={800}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                        Profile Information
                      </Typography>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(!isEditing)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: '#16a34a',
                          '&:hover': {
                            background: 'rgba(22, 163, 74, 0.05)',
                          },
                        }}
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </Box>

                    {message && (
                      <Alert
                        severity="success"
                        sx={{ mb: 3, borderRadius: 2 }}
                        onClose={() => setMessage('')}
                      >
                        {message}
                      </Alert>
                    )}

                    {error && (
                      <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: 2 }}
                        onClose={() => setError('')}
                      >
                        {error}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Name Field */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B7280',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            mb: 1,
                            display: 'block',
                          }}
                        >
                          Full Name
                        </Typography>
                        <TextField
                          fullWidth
                          id="name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          disabled={!isEditing || loading}
                          InputProps={{
                            startAdornment: (
                              <PersonIcon sx={{ color: '#9CA3AF', mr: 1.5 }} />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: isEditing ? '#fff' : '#F9FAFB',
                              '& fieldset': {
                                borderColor: '#E5E7EB',
                              },
                              '&:hover fieldset': {
                                borderColor: '#D1D5DB',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#16a34a',
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Email Field */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B7280',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            mb: 1,
                            display: 'block',
                          }}
                        >
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={true} // Email editing disabled for now as per requirements
                          InputProps={{
                            startAdornment: (
                              <EmailIcon sx={{ color: '#9CA3AF', mr: 1.5 }} />
                            ),
                            endAdornment: user?.emailVerified ? (
                              <Chip
                                icon={<CheckCircleIcon style={{ color: '#10b981' }} />}
                                label="Verified"
                                size="small"
                                sx={{
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  color: '#10b981',
                                  fontWeight: 600,
                                  border: 'none',
                                }}
                              />
                            ) : (
                              <Chip
                                label="Unverified"
                                size="small"
                                sx={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  fontWeight: 600,
                                  border: 'none',
                                }}
                              />
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#F9FAFB',
                              '& fieldset': {
                                borderColor: '#E5E7EB',
                              },
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#9CA3AF', mt: 0.5, display: 'block' }}>
                          Email cannot be changed directly. Contact support for assistance.
                        </Typography>
                      </Box>

                      {isEditing && (
                        <Grow in={true}>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Button
                              variant="outlined"
                              onClick={() => setIsEditing(false)}
                              disabled={loading}
                              sx={{
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.25,
                                borderRadius: 2,
                                borderColor: '#D1D5DB',
                                color: '#374151',
                                '&:hover': {
                                  borderColor: '#9CA3AF',
                                  background: '#F9FAFB',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={loading || !formik.isValid}
                              sx={{
                                flex: 1,
                                background: '#16a34a',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.25,
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
                                '&:hover': {
                                  background: '#15803d',
                                  boxShadow: '0 4px 8px rgba(22, 163, 74, 0.3)',
                                },
                              }}
                            >
                              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
                            </Button>
                          </Box>
                        </Grow>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;
