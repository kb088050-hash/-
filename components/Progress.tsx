import React, { useRef, useState } from 'react';
import { UserStats, Word } from '../types';
import { generateWordContent, parseCSV } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid'; // Actually we will use simple Math.random for no-deps UUID

interface Props {
  stats: UserStats;
  librarySize: number;
  onAddWords: (words: Word[]) => void;
  onBack: () => void;
}

export const Progress: React.FC<Props> = ({ stats, librarySize, onAddWords, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadFeedback("Parsing file...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const terms = parseCSV(text);
      
      setUploadFeedback(`Found ${terms.length} words. Generating artistic hooks...`);
      
      const newWords: Word[] = [];
      
      // In a real app, we might queue this. For MVP, we process a few concurrently
      // Limit to 3 for demo speed, or process all if small.
      const batchSize = Math.min(terms.length, 5); 
      
      for (let i = 0; i < batchSize; i++) {
        setUploadFeedback(`Creating hook for: ${terms[i]}...`);
        const generated = await generateWordContent(terms[i]);
        newWords.push({
            id: Math.random().toString(36).substr(2, 9),
            term: terms[i],
            definition: generated.definition || "Definition pending...",
            confusers: generated.confusers || ["Option A", "Option B", "Option C"],
            hookL1: generated.hookL1 || "Generating hook...",
            hookL2: generated.hookL2 || "Content pending...",
            comparison: generated.comparison || "Check definition.",
            status: 'new',
            lastReview: 0,
            errorCount: 0
        });
      }

      onAddWords(newWords);
      setIsProcessing(false);
      setUploadFeedback(`Success! ${newWords.length} words added. Hooks generated. Ready for tomorrow.`);
      
      // Reset after 3s
      setTimeout(() => setUploadFeedback(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white mb-6">
            &larr; Back
        </button>
        <h1 className="text-3xl font-serif mb-2">My Progress</h1>
        <p className="text-slate-400 text-sm">Consistent effort creates permanent memory.</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl">
                <div className="text-2xl font-light text-indigo-400">{stats.streak}</div>
                <div className="text-xs text-slate-500 uppercase">Day Streak</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
                <div className="text-2xl font-light text-emerald-400">{stats.totalMastered}</div>
                <div className="text-xs text-slate-500 uppercase">Mastered</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl col-span-2">
                <div className="text-2xl font-light text-white">{librarySize}</div>
                <div className="text-xs text-slate-500 uppercase">Total Words in Library</div>
            </div>
        </div>

        {/* Upload Section */}
        <div className="pt-8 border-t border-slate-800">
            <h2 className="text-lg font-medium mb-4">Import Library</h2>
            
            {!isProcessing ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                    <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <span className="text-sm text-slate-400">Upload CSV / Excel</span>
                    <span className="text-xs text-slate-600 mt-1">System will auto-generate hooks</span>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-indigo-300">{uploadFeedback}</p>
                </div>
            )}
            
            {uploadFeedback && !isProcessing && (
                <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-900 rounded-lg text-emerald-400 text-sm text-center">
                    {uploadFeedback}
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.txt"
                onChange={handleFileUpload}
            />
        </div>
      </div>
    </div>
  );
};
