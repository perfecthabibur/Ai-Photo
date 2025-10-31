import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImagesUpload: (files: FileList) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImagesUpload(e.target.files);
    }
  };
  
  const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImagesUpload(e.dataTransfer.files);
    }
  }, [onImagesUpload]);

  const openFileDialog = () => {
    const fileInput = document.getElementById('file-upload-input');
    fileInput?.click();
  };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${isDragging ? 'border-sky-400 scale-105' : ''}`}
      onDragEnter={(e) => handleDragEvent(e, true)}
      onDragLeave={(e) => handleDragEvent(e, false)}
      onDragOver={(e) => handleDragEvent(e, true)}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        id="file-upload-input"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        multiple
      />
      <div className="flex flex-col items-center justify-center text-center cursor-pointer">
        <div className="p-4 bg-sky-100 dark:bg-sky-900/50 rounded-full mb-4">
          <UploadIcon className="w-12 h-12 text-sky-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
            Upload your images to get started
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
            Drag & drop files or click to browse
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Supported formats: JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
};