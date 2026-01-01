export enum Page {
  HOME = 'HOME',
  STUDY_FLOW = 'STUDY_FLOW',
  WORD_DETAIL = 'WORD_DETAIL',
  MISTAKE_REVIEW = 'MISTAKE_REVIEW',
  PROGRESS = 'PROGRESS'
}

export enum CardType {
  CHOICE = 'CHOICE', // Multiple choice
  JUDGE = 'JUDGE',   // True/False
  FILL = 'FILL'      // Fill in the blank (simplified for MVP)
}

export interface Word {
  id: string;
  term: string;
  definition: string; // The "correct" meaning
  confusers: string[]; // Wrong meanings for multiple choice
  
  // AI Generated Content
  hookL1: string; // The 10-18 char artistic hook
  hookL2: string; // The deeper explanation (folded)
  comparison?: string; // "You thought X, it's actually Y" style logic
  
  // Learning State
  status: 'new' | 'learning' | 'mastered' | 'error';
  lastReview: number;
  errorCount: number;
}

export interface UserStats {
  todayDuration: number; // in seconds
  todayCount: number;
  totalMastered: number;
  streak: number;
}

export interface SessionState {
  queue: Word[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  startTime: number;
}
