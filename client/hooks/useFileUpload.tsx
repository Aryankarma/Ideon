"use client";

import { useState } from 'react';
import apiClient from '@/lib/api';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      const result = await apiClient.uploadFile(file);
      
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      throw error;
    }
  };

  const deleteFile = async (url: string): Promise<void> => {
    try {
      await apiClient.deleteFile(url);
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  };

  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  };

  return {
    uploadFile,
    deleteFile,
    resetUploadState,
    ...uploadState,
  };
};
