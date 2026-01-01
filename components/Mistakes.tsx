import React from 'react';
import { Word } from '../types';

interface Props {
  mistakes: Word[];
  onRetry: () => void;
  onHome: () => void;
}

export const MistakeReview: React.FC<Props> = ({ mistakes, onRetry, onHome }) => {
  // Logic: "Mistakes don't lecture, only retry".
  
  if (mistakes.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h2 className="text-2xl font-serif text-slate-800">Perfect Streak.</h2>
            <p className="text-slate-500">No mistakes to review right now.</p>
            <button onClick={onHome} className="px-6 py-2 bg-slate-200 rounded-full text-slate-700">Back Home</button>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6">
         <h1 className="text-2xl font-serif text-slate-900">Battle Scars</h1>
         <p className="text-slate-500 text-sm mt-1">{mistakes.length} words need recalibration.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="space-y-4">
          {mistakes.map(word => (
            <div key={word.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-rose-400">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-slate-800">{word.term}</h3>
                <span className="text-xs text-slate-400 font-mono">Mistake</span>
              </div>
              <p className="text-rose-700 text-sm font-medium">
                {word.comparison || `You missed: ${word.definition}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for "Retry 10" */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center px-6">
        <button 
          onClick={onRetry}
          className="w-full max-w-md h-14 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>Retry {Math.min(mistakes.length, 10)} Now</span>
        </button>
      </div>
    </div>
  );
};
