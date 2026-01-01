import React, { useState, useEffect, useCallback } from 'react';
import { Word, CardType } from '../types';

interface Props {
  queue: Word[];
  onComplete: (results: { correct: Word[], incorrect: Word[] }) => void;
  onUpdateStats: (durationDelta: number, countDelta: number) => void;
  onViewDetails: (word: Word) => void;
}

export const StudyFlow: React.FC<Props> = ({ queue, onComplete, onUpdateStats, onViewDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctList, setCorrectList] = useState<Word[]>([]);
  const [incorrectList, setIncorrectList] = useState<Word[]>([]);
  
  // Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const currentWord = queue[currentIndex];

  // Initialize options for current card
  useEffect(() => {
    if (!currentWord) return;
    
    // Mix definition with confusers
    const allOpts = [...currentWord.confusers, currentWord.definition];
    // Shuffle
    for (let i = allOpts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOpts[i], allOpts[j]] = [allOpts[j], allOpts[i]];
    }
    setOptions(allOpts);
    
    // Reset state
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedbackMsg("");
  }, [currentIndex, currentWord]);

  // Timer for stats
  useEffect(() => {
    const timer = setInterval(() => {
      onUpdateStats(1, 0); // Add 1 second every second
    }, 1000);
    return () => clearInterval(timer);
  }, [onUpdateStats]);

  const handleSelect = (option: string) => {
    if (selectedOption) return; // Prevent double click

    setSelectedOption(option);
    const correct = option === currentWord.definition;
    setIsCorrect(correct);

    if (correct) {
      setFeedbackMsg("Correct. The essence is captured.");
      onUpdateStats(0, 1); // Increment count
      setCorrectList(prev => [...prev, currentWord]);
    } else {
      setFeedbackMsg(currentWord.comparison || `Closer to: ${currentWord.definition}`);
      setIncorrectList(prev => [...prev, currentWord]);
    }

    // Auto Advance logic
    setTimeout(() => {
      if (currentIndex < queue.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Session Finished
        onComplete({ 
          correct: correct ? [...correctList, currentWord] : correctList,
          incorrect: correct ? incorrectList : [...incorrectList, currentWord]
        });
      }
    }, correct ? 1200 : 2500); // Give more time to read error feedback
  };

  if (!currentWord) return <div>Loading...</div>;

  const progress = ((currentIndex) / queue.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Progress Bar */}
      <div className="w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Word Display */}
        <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
              {currentWord.term}
            </h2>
            {/* Optional: Show part of speech or pronunciation if available in future */}
        </div>

        {/* Interaction Area */}
        <div className="w-full max-w-md space-y-3">
          {options.map((opt, idx) => {
            let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 text-slate-700 font-medium ";
            
            if (selectedOption === null) {
              btnClass += "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md cursor-pointer";
            } else if (opt === currentWord.definition) {
              btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800"; // Always highlight correct answer at end
            } else if (opt === selectedOption && !isCorrect) {
              btnClass += "bg-rose-50 border-rose-500 text-rose-800"; // Highlight wrong selection
            } else {
              btnClass += "bg-slate-50 border-transparent opacity-50"; // Dim others
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Toast */}
        <div className={`h-12 flex items-center justify-center transition-opacity duration-300 ${selectedOption ? 'opacity-100' : 'opacity-0'}`}>
          <p className={`text-sm font-medium px-4 py-2 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {feedbackMsg}
          </p>
        </div>

      </div>

      {/* Emergency Detail Link - "Too Hard?" */}
      <div className="absolute bottom-6 right-6">
        <button 
          onClick={() => onViewDetails(currentWord)}
          className="text-xs text-slate-400 hover:text-indigo-600 underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
