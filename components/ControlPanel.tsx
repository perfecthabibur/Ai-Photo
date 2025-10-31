import React from 'react';
import { ProcessMode } from '../types';
import { WandIcon, ResetIcon } from './icons';

interface ControlPanelProps {
  activeMode: ProcessMode;
  setActiveMode: (mode: ProcessMode) => void;
  onProcess: () => void;
  onReset: () => void;
  isProcessingDisabled?: boolean;
}

const processModes = Object.values(ProcessMode);

export const ControlPanel: React.FC<ControlPanelProps> = ({ activeMode, setActiveMode, onProcess, onReset, isProcessingDisabled = false }) => {
  return (
    <div className="w-full p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 space-y-6">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-3">
        Select Transformation
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {processModes.map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500
              ${activeMode === mode 
                ? 'bg-sky-500 dark:bg-sky-600 text-white shadow-md' 
                : 'bg-slate-200/70 dark:bg-slate-700/50 hover:bg-slate-300/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onProcess}
          disabled={isProcessingDisabled}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-fuchsia-500 rounded-lg shadow-lg hover:shadow-sky-500/30 dark:hover:shadow-sky-400/20 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
        >
          <WandIcon className="w-5 h-5" />
          Apply Transformation
        </button>
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-6 py-2 font-medium text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700/50 rounded-lg hover:bg-slate-300/90 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-slate-400"
        >
          <ResetIcon className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};