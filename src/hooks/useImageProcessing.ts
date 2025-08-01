import { useState, useCallback } from 'react';
import { ImageProcessor } from '../utils/imageProcessor';
import type { GridSize } from '../types/chart.types';

interface ProcessingOptions {
  gridSize: GridSize;
  maxColors: number;
  detailedMode?: boolean;
}

interface UploadState {
  file: File | null;
  isProcessing: boolean;
  error: string | null;
}

export const useImageProcessing = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isProcessing: false,
    error: null
  });

  const imageProcessor = new ImageProcessor();

  const handleFileUpload = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select a valid image file (JPEG, PNG, GIF, etc.)'
      }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadState(prev => ({
        ...prev,
        error: 'File size too large. Please select an image smaller than 10MB.'
      }));
      return;
    }

    setUploadState({
      file,
      isProcessing: false,
      error: null
    });
  }, []);

  const processImage = useCallback(async (options: ProcessingOptions): Promise<string[][]> => {
    if (!uploadState.file) {
      throw new Error('No file uploaded');
    }

    setUploadState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const pixels = await imageProcessor.processImage(uploadState.file, options);
      setUploadState(prev => ({ ...prev, isProcessing: false }));
      return pixels;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setUploadState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, [uploadState.file, imageProcessor]);

  const clearUpload = useCallback(() => {
    setUploadState({
      file: null,
      isProcessing: false,
      error: null
    });
  }, []);

  const suggestGridSize = useCallback((imageWidth: number, imageHeight: number): GridSize => {
    // Calculate optimal grid size based on image dimensions
    const aspectRatio = imageWidth / imageHeight;
    const maxGridSize = 80;
    const minGridSize = 10;

    let gridWidth: number;
    let gridHeight: number;

    if (aspectRatio > 1) {
      // Landscape image
      gridWidth = Math.min(maxGridSize, Math.max(minGridSize, Math.round(imageWidth / 20)));
      gridHeight = Math.min(maxGridSize, Math.max(minGridSize, Math.round(gridWidth / aspectRatio)));
    } else {
      // Portrait or square image
      gridHeight = Math.min(maxGridSize, Math.max(minGridSize, Math.round(imageHeight / 20)));
      gridWidth = Math.min(maxGridSize, Math.max(minGridSize, Math.round(gridHeight * aspectRatio)));
    }

    // Ensure minimum size
    gridWidth = Math.max(minGridSize, gridWidth);
    gridHeight = Math.max(minGridSize, gridHeight);

    return { width: gridWidth, height: gridHeight };
  }, []);

  return {
    uploadState,
    handleFileUpload,
    processImage,
    clearUpload,
    suggestGridSize
  };
}; 