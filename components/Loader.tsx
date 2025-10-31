import React, { useState, useEffect } from 'react';
import { ProcessMode } from '../types';

interface LoaderProps {
  mode: ProcessMode;
}

const getLoadingMessage = (mode: ProcessMode): string => {
  switch (mode) {
    case ProcessMode.REMOVE_WATERMARK:
      return "Removing watermark...";
    case ProcessMode.ENHANCE_QUALITY:
      return "Enhancing quality...";
    case ProcessMode.UPSCALE_4K:
      return "Upscaling to 4K...";
    case ProcessMode.RESTORE_COLOR:
      return "Restoring colors...";
    case ProcessMode.REMOVE_BACKGROUND:
      return "Removing background...";
    default:
      return "Processing image...";
  }
};

export const Loader: React.FC<LoaderProps> = ({ mode }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress as the actual progress from the API is not available.
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          return 95; // Stop at 95% to indicate it's finalizing
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 95);
      });
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity duration-300">
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-slate-200 dark:text-gray-600"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className="text-sky-400"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.3s' }}
          />
        </svg>
        <span className="text-white text-lg font-bold">{`${Math.round(progress)}%`}</span>
      </div>
      <p className="mt-4 text-white text-lg font-semibold animate-pulse">{getLoadingMessage(mode)}</p>
      <p className="mt-2 text-slate-300 text-sm">AI is working its magic. Please wait a moment.</p>
    </div>
  );
};