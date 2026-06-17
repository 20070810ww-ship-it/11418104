/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import WordBank from './components/WordBank';
import Flashcards from './components/Flashcards';
import QuizArena from './components/QuizArena';
import StatsView from './components/StatsView';

import { INITIAL_WORDS } from './data';
import { User, VocabularyWord, WordProgress, QuizRecord } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Global synchronized states
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [progress, setProgress] = useState<WordProgress[]>([]);
  const [quizRecords, setQuizRecords] = useState<QuizRecord[]>([]);
  const [streak, setStreak] = useState<number>(3); // Default motivated base streak

  // Check and load active user session on startup
  useEffect(() => {
    const cachedUserJson = localStorage.getItem('vocab_current_user');
    if (cachedUserJson) {
      try {
        const cachedUser = JSON.parse(cachedUserJson);
        setCurrentUser(cachedUser);
      } catch (e) {
        console.error('Failed to restore user session', e);
      }
    }
  }, []);

  // Sync user-specific databases when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setWords([]);
      setProgress([]);
      setQuizRecords([]);
      setStreak(3);
      return;
    }

    const userId = currentUser.id;

    // 1. Fetch user custom words and combine with INITIAL_WORDS
    const customWordsKey = `vocab_custom_words_${userId}`;
    const customWordsJson = localStorage.getItem(customWordsKey);
    let userCustomWords: VocabularyWord[] = [];
    if (customWordsJson) {
      try {
        userCustomWords = JSON.parse(customWordsJson);
      } catch (e) {
        console.error('Error loading custom words', e);
      }
    }
    // Prepend user customized words
    setWords([...userCustomWords, ...INITIAL_WORDS]);

    // 2. Fetch vocabulary status progress
    const progressKey = `vocab_progress_${userId}`;
    const progressJson = localStorage.getItem(progressKey);
    let userProgress: WordProgress[] = [];
    if (progressJson) {
      try {
        userProgress = JSON.parse(progressJson);
      } catch (e) {
        console.error('Error loading word progress', e);
      }
    } else {
      // Initialize empty progress list
      userProgress = [];
      localStorage.setItem(progressKey, JSON.stringify([]));
    }
    setProgress(userProgress);

    // 3. Fetch past quiz records
    const quizKey = `vocab_quiz_${userId}`;
    const quizJson = localStorage.getItem(quizKey);
    let userQuizzes: QuizRecord[] = [];
    if (quizJson) {
      try {
        userQuizzes = JSON.parse(quizJson);
      } catch (e) {
        console.error('Error loading quiz records', e);
      }
    }
    setQuizRecords(userQuizzes);

    // 4. Fetch study streaks
    const streakKey = `vocab_streak_${userId}`;
    const cachedStreak = localStorage.getItem(streakKey);
    if (cachedStreak) {
      setStreak(parseInt(cachedStreak, 10));
    } else {
      setStreak(3); // Motivating baseline
      localStorage.setItem(streakKey, '3');
    }

  }, [currentUser]);

  // Auth Operations
  const handleLoginSuccess = (user: User) => {
    localStorage.setItem('vocab_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('vocab_current_user');
    setCurrentUser(null);
  };

  // Learning Progress Toggles
  const handleUpdateProgress = (wordId: string, status: 'new' | 'learning' | 'mastered') => {
    if (!currentUser) return;

    const progressKey = `vocab_progress_${currentUser.id}`;
    const updated = [...progress];
    const index = updated.findIndex(p => p.wordId === wordId);

    if (index > -1) {
      updated[index] = {
        ...updated[index],
        status,
        reviewedCount: updated[index].reviewedCount + 1,
        lastReviewedAt: new Date().toISOString()
      };
    } else {
      updated.push({
        wordId,
        status,
        isFavorite: false,
        reviewedCount: 1,
        lastReviewedAt: new Date().toISOString()
      });
    }

    setProgress(updated);
    localStorage.setItem(progressKey, JSON.stringify(updated));

    // Boost streak on active mastering interaction
    if (status === 'mastered') {
      const currentStreakKey = `vocab_streak_${currentUser.id}`;
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(currentStreakKey, String(newStreak));
    }
  };

  const handleToggleFavorite = (wordId: string) => {
    if (!currentUser) return;

    const progressKey = `vocab_progress_${currentUser.id}`;
    const updated = [...progress];
    const index = updated.findIndex(p => p.wordId === wordId);

    if (index > -1) {
      updated[index] = {
        ...updated[index],
        isFavorite: !updated[index].isFavorite
      };
    } else {
      updated.push({
        wordId,
        status: 'new',
        isFavorite: true,
        reviewedCount: 0
      });
    }

    setProgress(updated);
    localStorage.setItem(progressKey, JSON.stringify(updated));
  };

  // Custom Vocab Operations
  const handleAddCustomWord = (newWordData: Omit<VocabularyWord, 'id' | 'isCustom'>) => {
    if (!currentUser) return;

    const customWord: VocabularyWord = {
      ...newWordData,
      id: `custom_${Date.now()}`,
      isCustom: true
    };

    const updatedWords = [customWord, ...words];
    setWords(updatedWords);

    // Save custom words only in LocalStorage
    const customWordsKey = `vocab_custom_words_${currentUser.id}`;
    const customOnly = updatedWords.filter(w => w.isCustom);
    localStorage.setItem(customWordsKey, JSON.stringify(customOnly));

    // Set initial 'learning' progress status for it
    handleUpdateProgress(customWord.id, 'learning');
  };

  const handleDeleteCustomWord = (wordId: string) => {
    if (!currentUser) return;

    const updatedWords = words.filter(w => w.id !== wordId);
    setWords(updatedWords);

    // Update custom words only
    const customWordsKey = `vocab_custom_words_${currentUser.id}`;
    const customOnly = updatedWords.filter(w => w.isCustom);
    localStorage.setItem(customWordsKey, JSON.stringify(customOnly));

    // Clear matching progress metric
    const progressKey = `vocab_progress_${currentUser.id}`;
    const updatedProg = progress.filter(p => p.wordId !== wordId);
    setProgress(updatedProg);
    localStorage.setItem(progressKey, JSON.stringify(updatedProg));
  };

  // Quiz records caching
  const handleAddScoreRecord = (score: number, total: number, category: string) => {
    if (!currentUser) return;

    const quizKey = `vocab_quiz_${currentUser.id}`;
    const newRecord: QuizRecord = {
      id: `quiz_${Date.now()}`,
      score,
      total,
      category,
      date: new Date().toISOString()
    };

    const updatedRecords = [newRecord, ...quizRecords];
    setQuizRecords(updatedRecords);
    localStorage.setItem(quizKey, JSON.stringify(updatedRecords));

    // Boost study streak for taking a quiz!
    const currentStreakKey = `vocab_streak_${currentUser.id}`;
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem(currentStreakKey, String(newStreak));
  };

  const handleClearQuizHistory = () => {
    if (!currentUser) return;
    const quizKey = `vocab_quiz_${currentUser.id}`;
    setQuizRecords([]);
    localStorage.setItem(quizKey, JSON.stringify([]));
  };

  // If not logged in, show Auth component directly
  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const masteredWordsCount = progress.filter(p => p.status === 'mastered').length;

  return (
    <div id="full-workspace-root" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        streak={streak}
        masteredCount={masteredWordsCount}
        totalCount={words.length}
      />

      {/* Main Body with Sidebar Drawer and Content card area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          masteredWordsCount={masteredWordsCount}
          totalWordsCount={words.length}
        />

        {/* Content Box with outer container */}
        <main id="app-workspace-main" className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="max-w-4.5xl mx-auto">
            {/* Display relevant screen or cards based on selected tab */}
            {activeTab === 'dashboard' && (
              <Dashboard
                currentUser={currentUser}
                words={words}
                progress={progress}
                streak={streak}
                setActiveTab={setActiveTab}
                onOpenAddCustomWord={() => {
                  setActiveTab('bank');
                  // Give slight delay to open form
                  setTimeout(() => {
                    const btn = document.getElementById('bank-add-custom-word-btn');
                    if (btn) btn.click();
                  }, 100);
                }}
              />
            )}

            {activeTab === 'bank' && (
              <WordBank
                words={words}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onToggleFavorite={handleToggleFavorite}
                onAddCustomWord={handleAddCustomWord}
              />
            )}

            {activeTab === 'flashcards' && (
              <Flashcards
                words={words}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizArena
                words={words}
                onAddScoreRecord={handleAddScoreRecord}
              />
            )}

            {activeTab === 'stats' && (
              <StatsView
                quizRecords={quizRecords}
                words={words}
                progress={progress}
                onDeleteCustomWord={handleDeleteCustomWord}
                onClearQuizHistory={handleClearQuizHistory}
              />
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
