import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ResultViewer } from './components/ResultViewer';
import { Loader } from './components/Loader';
import { ImageGallery } from './components/ImageGallery';
import { processImageWithGemini } from './services/geminiService';
import { ProcessMode } from './types';

type Theme = 'light' | 'dark' | 'system';
type ImageObject = { url: string; file: File };

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from local storage or default to system
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  const [originalImages, setOriginalImages] = useState<ImageObject[]>([]);
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<ImageObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ProcessMode>(ProcessMode.REMOVE_WATERMARK);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemPrefersDark);
        } else {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    };

    applyTheme();

    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme();
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'system' : 'light');
  };

  const handleImagesUpload = (files: FileList) => {
    const newImages: ImageObject[] = [];
    for (const file of Array.from(files)) {
      if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        const url = URL.createObjectURL(file);
        newImages.push({ url, file });
      }
    }

    if (newImages.length > 0) {
      const allImages = [...originalImages, ...newImages];
      setOriginalImages(allImages);
      // Select the first of the newly uploaded images
      setSelectedImage(newImages[0]);
      setError(null);
    } else if (files.length > 0) {
      setError('Unsupported file format. Please upload JPG, PNG, or WEBP.');
    }
  };
  
  const handleSelectImage = (image: ImageObject) => {
    setSelectedImage(image);
  };

  const handleReset = () => {
    originalImages.forEach(img => URL.revokeObjectURL(img.url));
    setOriginalImages([]);
    setProcessedImages({});
    setSelectedImage(null);
    setError(null);
    setIsLoading(false);
  }

  const handleProcessImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setProcessedImages(prev => {
        const newState = {...prev};
        delete newState[selectedImage.url];
        return newState;
      });

    try {
      const resultBase64 = await processImageWithGemini(selectedImage.file, activeMode);
      setProcessedImages(prev => ({ ...prev, [selectedImage.url]: `data:image/png;base64,${resultBase64}` }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, activeMode]);


  return (
    <div className={`min-h-screen w-full font-sans text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 transition-colors duration-300`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-100 via-violet-100 to-fuchsia-100 dark:from-slate-900 dark:via-indigo-900/40 dark:to-purple-900/60 -z-0"></div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Header theme={theme} onThemeToggle={handleThemeToggle} />
        
        <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col items-center justify-center">
          {isLoading && <Loader mode={activeMode} />}
          {error && (
            <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative my-4 max-w-md text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </button>
            </div>
          )}

          {!originalImages.length && !isLoading && <ImageUploader onImagesUpload={handleImagesUpload} />}

          {originalImages.length > 0 && !isLoading && (
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                 <ImageGallery
                    images={originalImages}
                    selectedImageUrl={selectedImage?.url}
                    processedImageUrls={Object.keys(processedImages)}
                    onSelectImage={handleSelectImage}
                 />
                 <ControlPanel 
                    activeMode={activeMode}
                    setActiveMode={setActiveMode}
                    onProcess={handleProcessImage}
                    onReset={handleReset}
                    isProcessingDisabled={!selectedImage}
                 />
              </div>
              <div className="w-full lg:w-2/3">
                 {selectedImage ? (
                    <ResultViewer
                        key={selectedImage.url}
                        originalImage={selectedImage.url}
                        processedImage={processedImages[selectedImage.url] || null}
                    />
                 ) : (
                    <div className="w-full aspect-video rounded-2xl flex items-center justify-center p-6 shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-400">Select an image from the gallery to begin.</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} AI Watermark Remover & Image Enhancer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}