import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Volume2, 
  CheckCircle, 
  Bookmark, 
  Filter, 
  Sparkles 
} from 'lucide-react';
import { VocabularyWord, WordProgress } from '../types';
import { CATEGORIES } from '../data';

interface FlashcardsProps {
  words: VocabularyWord[];
  progress: WordProgress[];
  onUpdateProgress: (wordId: string, status: 'new' | 'learning' | 'mastered') => void;
}

export default function Flashcards({
  words,
  progress,
  onUpdateProgress
}: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // Filter words by category
  const filteredWords = words.filter(
    w => selectedCategory === '全部' || w.category === selectedCategory
  );

  const currentWord = filteredWords[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Avoid flipping the card when clicking the audio icon
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getWordProgress = (wordId: string): WordProgress => {
    return progress.find(p => p.wordId === wordId) || {
      wordId,
      status: 'new',
      isFavorite: false,
      reviewedCount: 0
    };
  };

  const currentProg = currentWord ? getWordProgress(currentWord.id) : null;

  return (
    <div id="flashcards-container" className="max-w-2xl mx-auto space-y-6">
      
      {/* Title & info description */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">互動單字閃卡</h2>
        <p className="text-xs text-gray-500 mt-0.5">點擊卡片自由翻轉，隨時掌握與標記學習狀態</p>
      </div>

      {/* Slide / Category Filter select */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-5 flex-wrap shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">選擇閃卡訓練主題:</span>
        </div>

        <select
          id="flashcard-category-selector"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="bg-gray-50 border border-gray-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-slate-800"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat} ({words.filter(w => cat === '全部' || w.category === cat).length} 個)</option>
          ))}
        </select>
      </div>

      {currentWord ? (
        <div className="space-y-6">
          
          {/* Card Wrapper containing 3D Flip style effect */}
          <div 
            id="flashcard-3d-wrapper"
            className="perspective-1000 w-full h-80 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              
              {/* === CARD FRONT SIDE === */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-gray-100 p-8 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-colors">
                
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-150">
                    {currentWord.category}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentWord.difficulty === 'Elementary' ? 'bg-emerald-50 text-emerald-800' :
                    currentWord.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-800' :
                    'bg-red-50 text-red-800'
                  }`}>
                    {currentWord.difficulty}
                  </span>
                </div>

                {/* Vocabulary Headword with speak trigger */}
                <div className="text-center space-y-3">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-wide">
                    {currentWord.word}
                  </h3>
                  
                  <button
                    id="flashcard-speak-btn-front"
                    onClick={(e) => handleSpeak(e, currentWord.word)}
                    className="mx-auto p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-all flex items-center justify-center shadow-xs"
                    title="播放單字朗讀"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct hints help lines */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-indigo-400" />
                  <span>點擊卡片以翻看單字釋義</span>
                </div>

              </div>



              {/* === CARD BACK SIDE === */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-slate-100 rounded-3xl p-8 flex flex-col justify-between shadow-lg">
                
                {/* Back side details */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 font-mono">美式音標: {currentWord.phonetic}</span>
                  <span className="text-xs text-emerald-400 font-semibold">隨堂例句輔助</span>
                </div>

                {/* Translation & phonetic detail definitions */}
                <div className="space-y-4 my-2">
                  <div className="text-center">
                    <span className="text-2xs uppercase tracking-widest text-indigo-400 font-mono block">中文釋義</span>
                    <p className="text-xl sm:text-2.5xl font-extrabold text-white mt-1">
                      {currentWord.translation}
                    </p>
                  </div>

                  <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-xs text-slate-200 italic leading-relaxed font-serif">
                      "{currentWord.example}"
                    </p>
                    <p className="text-[11px] text-indigo-300 mt-2">
                      {currentWord.exampleTranslation}
                    </p>
                  </div>
                </div>

                {/* Flip back tips */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>點擊卡片翻回正面</span>
                </div>

              </div>

            </div>
          </div>

          {/* Quick Mark controls right below the active card */}
          {currentProg && (
            <div id="flashcard-mark-bar" className="flex justify-center gap-3.5">
              <button
                id="flashcard-mark-learning"
                onClick={() => onUpdateProgress(currentWord.id, 'learning')}
                className={`flex-1 max-w-[180px] p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  currentProg.status === 'learning'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold'
                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                }`}
              >
                <Bookmark className="w-4 h-4" /> 標記為學習中
              </button>

              <button
                id="flashcard-mark-mastered"
                onClick={() => onUpdateProgress(currentWord.id, 'mastered')}
                className={`flex-1 max-w-[180px] p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  currentProg.status === 'mastered'
                    ? 'bg-emerald-500/15 text-emerald-555 border-emerald-500/30 font-bold shadow-xs'
                    : 'bg-white text-gray-555 border-gray-100 hover:bg-emerald-50/40'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> 標記已熟記
              </button>
            </div>
          )}

          {/* Pagination Navigation arrows with layout micro indicator */}
          <div className="flex items-center justify-between pt-2">
            <button
              id="flashcard-prev-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:hover:bg-white rounded-2xl transition-all shadow-xs"
              title="上一個單字"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Micro details indicator */}
            <div className="text-center font-mono space-y-1">
              <span className="text-xs font-bold text-gray-800">
                {currentIndex + 1} / {filteredWords.length}
              </span>
              
              {/* Progressive track bar */}
              <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden mx-auto">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              id="flashcard-next-btn"
              onClick={handleNext}
              disabled={currentIndex === filteredWords.length - 1}
              className="p-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:hover:bg-white rounded-2xl transition-all shadow-xs"
              title="下一個單字"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xs">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-650">無符合該分類的主題單字</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            您可以前往「核心單字庫」建立一些自訂單字，或切換主題分類。
          </p>
        </div>
      )}
    </div>
  );
}
