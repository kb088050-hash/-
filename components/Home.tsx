import React from 'react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
  onStart: () => void;
  wordCount: number;
}

export const Home: React.FC<Props> = ({ stats, onStart, wordCount }) => {
  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 text-slate-800 p-6">
      <div className="flex-1 flex flex-col justify-center items-center space-y-12 w-full max-w-md animate-fade-in-up">
        
        {/* Date / Greeting */}
        <div className="text-center">
          <p className="text-slate-400 text-sm tracking-widest uppercase mb-2">Today's Mission</p>
          <h1 className="text-3xl font-serif text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
        </div>

        {/* Stats Display - Clean & Big */}
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-4xl font-light text-indigo-600 mb-1">{formatTime(stats.todayDuration)}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Study Time</span>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-4xl font-light text-indigo-600 mb-1">{stats.todayCount}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Words Learned</span>
          </div>
        </div>

        <div className="text-center">
           <p className="text-slate-500 text-sm">Total Library: {wordCount} words</p>
        </div>

        {/* Main CTA */}
        <button 
          onClick={onStart}
          className="w-full max-w-xs h-16 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-indigo-200 flex items-center justify-center space-x-2"
        >
          <span>Start Daily Task</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
      
      {/* Footer Quote or simple branding */}
      <div className="h-12 flex items-center justify-center text-slate-300 text-xs tracking-widest">
        MNEMOSYNE MVP v1
      </div>
    </div>
  );
};
