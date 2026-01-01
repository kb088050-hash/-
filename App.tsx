import React, { useState, useEffect } from 'react';
import { Page, Word, UserStats } from './types';
import { MOCK_WORDS } from './constants';
import { Home } from './components/Home';
import { StudyFlow } from './components/StudyFlow';
import { WordDetail } from './components/WordDetail';
import { MistakeReview } from './components/Mistakes';
import { Progress } from './components/Progress';
import { generateWordContent } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [stats, setStats] = useState<UserStats>({
    todayDuration: 0,
    todayCount: 0,
    totalMastered: 0,
    streak: 1
  });

  // Session State
  const [studyQueue, setStudyQueue] = useState<Word[]>([]);
  const [selectedDetailWord, setSelectedDetailWord] = useState<Word | null>(null);
  
  // Initialization
  useEffect(() => {
    // Load from local storage or use mock
    const savedWords = localStorage.getItem('mnemosyne_words');
    const savedStats = localStorage.getItem('mnemosyne_stats');
    
    if (savedWords) {
      setUserWords(JSON.parse(savedWords));
    } else {
      setUserWords(MOCK_WORDS);
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('mnemosyne_words', JSON.stringify(userWords));
    localStorage.setItem('mnemosyne_stats', JSON.stringify(stats));
  }, [userWords, stats]);

  // Actions
  const startSession = () => {
    // Logic: 30 seconds to start.
    // Pick 10 random words from 'new' or 'learning'
    const queue = [...userWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
    
    setStudyQueue(queue);
    setCurrentPage(Page.STUDY_FLOW);
  };

  const handleSessionComplete = (results: { correct: Word[], incorrect: Word[] }) => {
    // Update word status logic here (omitted for brevity, assume simple toggle)
    
    // If mistakes, go to Mistake Review
    if (results.incorrect.length > 0) {
      // Filter the queue to only incorrect ones for the review page
      setStudyQueue(results.incorrect); 
      setCurrentPage(Page.MISTAKE_REVIEW);
    } else {
      // Else back to home
      setCurrentPage(Page.HOME);
    }
  };

  const handleRetryMistakes = () => {
    // Start flow again with current queue (which contains mistakes)
    setCurrentPage(Page.STUDY_FLOW);
  };

  const updateStats = (durationDelta: number, countDelta: number) => {
    setStats(prev => ({
      ...prev,
      todayDuration: prev.todayDuration + durationDelta,
      todayCount: prev.todayCount + countDelta
    }));
  };

  const handleRegenerateHook = async (word: Word) => {
     // Call Gemini to get new hook
     const newContent = await generateWordContent(word.term);
     setUserWords(prev => prev.map(w => w.id === word.id ? { ...w, ...newContent } : w));
     // Update current detailed view if open
     if (selectedDetailWord?.id === word.id) {
         setSelectedDetailWord(prev => prev ? { ...prev, ...newContent } : null);
     }
  };

  // Rendering Routing
  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return (
          <div className="relative h-full">
            <Home 
              stats={stats} 
              wordCount={userWords.length} 
              onStart={startSession} 
            />
            {/* Minimal access to progress/settings */}
            <button 
                onClick={() => setCurrentPage(Page.PROGRESS)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </button>
          </div>
        );
      
      case Page.STUDY_FLOW:
        return (
          <StudyFlow 
            queue={studyQueue}
            onComplete={handleSessionComplete}
            onUpdateStats={updateStats}
            onViewDetails={(word) => {
              setSelectedDetailWord(word);
              setCurrentPage(Page.WORD_DETAIL);
            }}
          />
        );

      case Page.WORD_DETAIL:
        return selectedDetailWord ? (
          <WordDetail 
            word={selectedDetailWord}
            onBack={() => setCurrentPage(Page.STUDY_FLOW)} // Return to flow context
            onRegenerateHook={handleRegenerateHook}
          />
        ) : null;

      case Page.MISTAKE_REVIEW:
        return (
          <MistakeReview 
            mistakes={studyQueue} // Contains only mistakes passed from session
            onRetry={handleRetryMistakes}
            onHome={() => setCurrentPage(Page.HOME)}
          />
        );

      case Page.PROGRESS:
        return (
          <Progress 
            stats={stats}
            librarySize={userWords.length}
            onAddWords={(newWords) => setUserWords(prev => [...prev, ...newWords])}
            onBack={() => setCurrentPage(Page.HOME)}
          />
        );
        
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      {/* Mobile Container Simulator */}
      <div className="w-full max-w-md h-full md:h-[800px] bg-white md:rounded-3xl shadow-2xl overflow-hidden relative">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
