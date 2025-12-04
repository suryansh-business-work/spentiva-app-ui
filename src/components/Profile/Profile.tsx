import React, { useCallback } from 'react';
import { Container, Box, Typography, Fade, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { useProfileUpdate } from './hooks/useProfileUpdate';
import { useEmailVerification } from './hooks/useEmailVerification';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import ProfileDetailsCard from './components/ProfileDetailsCard';
import EmailVerificationDialog from './components/EmailVerificationDialog';

const Profile: React.FC = () => {
  const { user, updateUser, token } = useAuth();
  const theme = useTheme();

  // Profile update hook
  const {
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
    getPhotoUrl,
    updateProfile,
    uploadPhoto,
    clearMessages: clearUpdateMessages,
  } = useProfileUpdate(user, updateUser, token);

  // Memoize the verification success callback
  const handleVerificationSuccess = useCallback(async () => {
    // Reload user data after successful verification
    if (user) {
      const updatedUser: User = { ...user, emailVerified: true };
      updateUser(updatedUser);
    }
  }, [user, updateUser]);

  // Email verification hook
  const {
    loading: verificationLoading,
    error: verificationError,
    success: verificationSuccess,
    isDialogOpen,
    otpSent,
    countdown,
    sendVerificationOtp,
    verifyEmail,
    openDialog,
    closeDialog,
    clearMessages: clearVerificationMessages,
  } = useEmailVerification(user?.email || '', handleVerificationSuccess);

  /**
   * Handle photo change
   */
  const handlePhotoChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await uploadPhoto(file);
      }
    },
    [uploadPhoto]
  );

  /**
   * Handle profile update
   */
  const handleUpdateProfile = useCallback(
    async (name: string) => {
      return await updateProfile(name);
    },
    [updateProfile]
  );

  /**
   * Handle verification button click
   */
  const handleVerifyEmail = useCallback(() => {
    openDialog();
  }, [openDialog]);

  /**
   * Handle send OTP
   */
  const handleSendOtp = useCallback(async () => {
    await sendVerificationOtp();
  }, [sendVerificationOtp]);

  /**
   * Handle verify OTP
   */
  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      await verifyEmail(otp);
    },
    [verifyEmail]
  );

  /**
   * Handle resend OTP
   */
  const handleResendOtp = useCallback(async () => {
    await sendVerificationOtp();
  }, [sendVerificationOtp]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true} timeout={500}>
          <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                My Profile
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Manage your personal information and account settings
              </Typography>
            </Box>

            {/* Main Content Grid */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 3 }}
            >
              {/* Left: Profile Photo Card */}
              <ProfilePhotoCard
                user={user}
                loading={updateLoading}
                photoUrl={getPhotoUrl()}
                onPhotoChange={handlePhotoChange}
              />

              {/* Right: Profile Details Card */}
              <ProfileDetailsCard
                user={user}
                loading={updateLoading}
                verificationLoading={verificationLoading}
                message={updateMessage}
                error={updateError}
                verificationSuccess={verificationSuccess}
                verificationError={verificationError}
                onUpdateProfile={handleUpdateProfile}
                onClearMessages={clearUpdateMessages}
                onVerifyEmail={handleVerifyEmail}
                onResendOtp={handleResendOtp}
                onClearVerificationMessages={clearVerificationMessages}
              />
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        open={isDialogOpen}
        email={user?.email || ''}
        loading={verificationLoading}
        error={verificationError}
        success={verificationSuccess}
        otpSent={otpSent}
        countdown={countdown}
        onClose={closeDialog}
        onSendOtp={handleSendOtp}
        onVerify={handleVerifyOtp}
        onClearMessages={clearVerificationMessages}
      />
    </Box>
  );
};

export default Profile;
