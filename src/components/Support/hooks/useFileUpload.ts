import { useState } from 'react';
import { FileUploadResponse, UploadedFileData } from '../../../types/fileUpload.types';
import { endpoints } from '../../../config/api';
import axios from 'axios';

interface UseFileUploadResult {
  uploadFile: (file: File) => Promise<UploadedFileData | null>;
  uploading: boolean;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadedFileData | null> => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');

      const response = await axios.post<FileUploadResponse>(endpoints.imagekit.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.data.status === 'success' && response.data.data.length > 0) {
        return response.data.data[0];
      }

      throw new Error('Upload failed');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to upload file';
      setError(errorMessage);
      console.error('File upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};
