import React, { useRef, useCallback } from 'react';
import type { ImageUploadState } from '../types/chart.types';

interface ImageUploadProps {
  uploadState: ImageUploadState;
  onFileUpload: (file: File) => void;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadState,
  onFileUpload,
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed border-lavender-300 rounded-3xl p-12 text-center hover:border-lavender-400 transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm hover:shadow-xl hover:scale-105"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload image"
      >
        <div className="text-6xl mb-6 animate-float">🧶</div>
        <h3 className="text-2xl font-handwritten text-yarn-700 mb-4">
          Upload Your Image
        </h3>
        <p className="text-lg text-beige-600 font-body mb-6">
          Drag and drop an image here, or click to browse
        </p>
        <p className="text-sm text-beige-500 font-body">
          Supports JPEG, PNG, GIF, WebP (max 10MB)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {uploadState.error && (
        <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-3xl">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-red-800 font-body">Upload Error</span>
          </div>
          <p className="text-red-700 mt-2 text-sm font-body">{uploadState.error}</p>
        </div>
      )}

      {uploadState.file && (
        <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">✅</div>
              <div>
                <p className="font-medium text-green-800 font-body">{uploadState.file.name}</p>
                <p className="text-sm text-green-600 font-body">
                  {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={onClear}
              className="text-sm text-green-600 hover:text-green-800 px-3 py-2 rounded-2xl hover:bg-green-100 transition-all duration-300 font-body"
              aria-label="Remove uploaded file"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 