
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DownloadIcon } from './icons';

interface ResultViewerProps {
  originalImage: string;
  processedImage: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ originalImage, processedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    e.preventDefault();
  };

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  }, [handleMove]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
     if (isDraggingRef.current) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);


  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden select-none" ref={containerRef}>
        <img src={originalImage} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain" />
        {processedImage ? (
            <div className="absolute top-0 left-0 w-full h-full">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={() => isDraggingRef.current = true}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                  </div>
                </div>
            </div>
        ) : (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white font-medium">Your processed image will appear here</p>
            </div>
        )}
        <div className="absolute top-2 left-2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">Before</div>
        {processedImage && <div className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">After</div>}
      </div>

      {processedImage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-400/20 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-emerald-400"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};