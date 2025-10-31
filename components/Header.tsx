import React from 'react';
import { SunIcon, MoonIcon, SparklesIcon, DesktopIcon } from './icons';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  return (
    <header className="w-full max-w-6xl mx-auto py-4 px-2 md:px-0 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-8 h-8 text-sky-500" />
        <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-fuchsia-500">
          AI Watermark Remover & Enhancer
        </h1>
      </div>
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 focus:ring-sky-500"
        aria-label={
          theme === 'light' ? 'Switch to dark mode' :
          theme === 'dark' ? 'Switch to system preference' :
          'Switch to light mode'
        }
        title={
          theme === 'light' ? 'Switch to dark mode' :
          theme === 'dark' ? 'Switch to system preference' :
          'Switch to light mode'
        }
      >
        {theme === 'light' ? <MoonIcon className="w-6 h-6 text-slate-600" /> :
         theme === 'dark' ? <DesktopIcon className="w-6 h-6 text-sky-400" /> :
         <SunIcon className="w-6 h-6 text-amber-400" />
        }
      </button>
    </header>
  );
};