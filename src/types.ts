export interface User {
  id: string;
  username: string;
  password?: string; // Stored locally for simple simulation
  name: string;
  createdAt: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  category: string;
  difficulty: 'Elementary' | 'Intermediate' | 'Advanced';
  isCustom?: boolean;
}

export interface WordProgress {
  wordId: string;
  status: 'new' | 'learning' | 'mastered';
  isFavorite: boolean;
  reviewedCount: number;
  lastReviewedAt?: string;
}

export interface QuizRecord {
  id: string;
  score: number;
  total: number;
  category: string;
  date: string;
}
