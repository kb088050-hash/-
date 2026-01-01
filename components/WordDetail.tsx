import React, { useState } from 'react';
import { Word } from '../types';

interface Props {
  word: Word;
  onBack: () => void;
  onRegenerateHook?: (word: Word) => void;
}

export const WordDetail: React.FC<Props> = ({ word, onBack, onRegenerateHook }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Navbar */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100">
        <button onClick={onBack} className="p-2 text-slate-500 hover:text-slate-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="ml-4 font-bold text-slate-400 text-xs tracking-widest uppercase">Word Detail</span>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-md mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-2 mt-10">
            <h1 className="text-5xl font-serif text-slate-900">{word.term}</h1>
            <p className="text-slate-500 text-lg font-light">{word.definition}</p>
          </div>

          {/* L1 Hook - Always Visible */}
          <div className="bg-indigo-50 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <p className="text-xl md:text-2xl font-serif text-indigo-900 leading-relaxed text-center">
              "{word.hookL1}"
            </p>
            <div className="mt-6 flex justify-center">
               <button 
                 onClick={() => onRegenerateHook && onRegenerateHook(word)}
                 className="text-xs text-indigo-400 hover:text-indigo-600 font-medium flex items-center space-x-1"
               >
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 <span>Change Method</span>
               </button>
            </div>
          </div>

          {/* Folded Deep Content */}
          <div className="border-t border-slate-100 pt-8">
            {!isExpanded ? (
              <button 
                onClick={() => setIsExpanded(true)}
                className="w-full py-4 text-slate-400 hover:text-slate-600 text-sm tracking-wide flex flex-col items-center space-y-2 group"
              >
                <span>Tap for Deep Dive</span>
                <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            ) : (
              <div className="space-y-8 animate-fade-in-down">
                {/* L2 Deep Hook */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Conceptual Link</h3>
                  <p className="text-slate-700 leading-relaxed font-light">
                    {word.hookL2}
                  </p>
                </div>

                {/* Confusion correction */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nuance Correction</h3>
                  <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {word.comparison}
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-full pt-4 text-slate-300 hover:text-slate-500 text-xs text-center"
                >
                  Collapse
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
