import React from 'react';
import { CheckCircleIcon } from './icons';

type ImageObject = { url: string; file: File };

interface ImageGalleryProps {
  images: ImageObject[];
  selectedImageUrl?: string;
  processedImageUrls: string[];
  onSelectImage: (image: ImageObject) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedImageUrl, processedImageUrls, onSelectImage }) => {
  return (
    <div className="w-full p-4 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-3 px-2">
            Image Queue ({images.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
            {images.map((image) => {
                const isSelected = image.url === selectedImageUrl;
                const isProcessed = processedImageUrls.includes(image.url);

                return (
                    <button
                        key={image.url}
                        onClick={() => onSelectImage(image)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 ${isSelected ? 'ring-2 ring-sky-500' : 'ring-0 hover:scale-105'}`}
                        aria-label={`Select image ${image.file.name}`}
                    >
                        <img src={image.url} alt={image.file.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity"></div>
                        {isProcessed && (
                            <div className="absolute top-1 right-1 p-0.5 bg-green-500 rounded-full text-white" title="Processed">
                                <CheckCircleIcon className="w-4 h-4" />
                            </div>
                        )}
                         {isSelected && (
                            <div className="absolute inset-0 border-2 border-sky-500 rounded-lg pointer-events-none"></div>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};