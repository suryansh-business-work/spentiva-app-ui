import { useState } from 'react';
import { endpoints } from '../../../config/api';
import { postRequest } from '../../../utils/http';

interface VerificationState {
  loading: boolean;
  error: string;
  success: string;
  isDialogOpen: boolean;
}

export const useEmailVerification = (userEmail: string, onVerificationSuccess: () => void) => {
  const [state, setState] = useState<VerificationState>({
    loading: false,
    error: '',
    success: '',
    isDialogOpen: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /**
   * Send verification OTP to email
   */
  const sendVerificationOtp = async () => {
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const response = await postRequest(endpoints.auth.sendVerificationOtp, { email: userEmail });
      const message = response.data?.message || 'Verification code sent to your email';

      setState(prev => ({ ...prev, loading: false, success: message }));
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown

      // Start countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send verification code';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  };

  /**
   * Verify email with OTP
   */
  const verifyEmail = async (otp: string) => {
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const response = await postRequest(endpoints.auth.verifyEmail, { email: userEmail, otp });
      const message = response.data?.message || 'Email verified successfully';

      setState(prev => ({ ...prev, loading: false, success: message, isDialogOpen: false }));
      setOtpSent(false);

      // Call success callback
      onVerificationSuccess();

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Invalid or expired OTP';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  };

  /**
   * Open verification dialog
   */
  const openDialog = () => {
    setState(prev => ({ ...prev, isDialogOpen: true, error: '', success: '' }));
  };

  /**
   * Close verification dialog
   */
  const closeDialog = () => {
    setState(prev => ({ ...prev, isDialogOpen: false, error: '', success: '' }));
    setOtpSent(false);
    setCountdown(0);
  };

  /**
   * Clear messages
   */
  const clearMessages = () => {
    setState(prev => ({ ...prev, error: '', success: '' }));
  };

  return {
    ...state,
    otpSent,
    countdown,
    sendVerificationOtp,
    verifyEmail,
    openDialog,
    closeDialog,
    clearMessages,
  };
};
