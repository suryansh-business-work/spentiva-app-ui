import { useState } from 'react';
import { endpoints, getApiUrl } from '../../../config/api';
import { putRequest, postRequest } from '../../../utils/http';

interface ProfileUpdateState {
  loading: boolean;
  error: string;
  message: string;
}

export const useProfileUpdate = (
  user: any,
  updateUser: (user: any) => void,
  _token: string | null
) => {
  const [state, setState] = useState<ProfileUpdateState>({
    loading: false,
    error: '',
    message: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  /**
   * Get profile photo URL
   */
  const getPhotoUrl = (): string | undefined => {
    if (photoPreview) return photoPreview;
    if (user?.profilePhoto) {
      if (user.profilePhoto.startsWith('http')) {
        return user.profilePhoto;
      }
      return `${getApiUrl()}/${user.profilePhoto}`;
    }
    return undefined;
  };

  /**
   * Update user profile (name)
   */
  const updateProfile = async (name: string) => {
    setState({ loading: true, error: '', message: '' });

    try {
      const response = await putRequest(endpoints.auth.profile, { name });
      const updatedUser = response.data?.user || response.data?.data?.user;

      if (updatedUser) {
        updateUser(updatedUser);
        setState({ loading: false, error: '', message: 'Profile updated successfully' });
        return true;
      } else {
        setState({ loading: false, error: '', message: 'Profile updated successfully' });
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setState({ loading: false, error: errorMessage, message: '' });
      return false;
    }
  };

  /**
   * Upload profile photo
   */
  const uploadPhoto = async (file: File) => {
    setState({ loading: true, error: '', message: '' });

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await postRequest(endpoints.auth.profilePhoto, formData);
      const updatedUser = response.data?.user || response.data?.data?.user;

      if (updatedUser) {
        updateUser(updatedUser);
        setState({ loading: false, error: '', message: 'Profile photo updated successfully' });
      }

      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload photo';
      setState({ loading: false, error: errorMessage, message: '' });
      return false;
    }
  };

  /**
   * Clear messages
   */
  const clearMessages = () => {
    setState(prev => ({ ...prev, error: '', message: '' }));
  };

  return {
    ...state,
    photoPreview,
    getPhotoUrl,
    updateProfile,
    uploadPhoto,
    clearMessages,
  };
};
