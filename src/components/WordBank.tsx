import React, { useState } from 'react';
import { 
  Search, 
  Volume2, 
  Star, 
  Plus, 
  Filter, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { VocabularyWord, WordProgress } from '../types';
import { CATEGORIES, DIFFICULTIES } from '../data';

interface WordBankProps {
  words: VocabularyWord[];
  progress: WordProgress[];
  onUpdateProgress: (wordId: string, status: 'new' | 'learning' | 'mastered') => void;
  onToggleFavorite: (wordId: string) => void;
  onAddCustomWord: (newWord: Omit<VocabularyWord, 'id' | 'isCustom'>) => void;
}

export default function WordBank({
  words,
  progress,
  onUpdateProgress,
  onToggleFavorite,
  onAddCustomWord
}: WordBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for custom word
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExampleTranslation, setNewExampleTranslation] = useState('');
  const [newCategory, setNewCategory] = useState('商務英語');
  const [newDifficulty, setNewDifficulty] = useState<'Elementary' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [formError, setFormError] = useState('');

  // Audio Pronunciation trigger (Web Speech API)
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for clear learning speed
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的瀏覽器不支援語音朗讀功能。');
    }
  };

  // Helper to find word progress details
  const getWordProgress = (wordId: string): WordProgress => {
    return progress.find(p => p.wordId === wordId) || {
      wordId,
      status: 'new',
      isFavorite: false,
      reviewedCount: 0
    };
  };

  // Filter and Search logic
  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translation.includes(searchTerm) ||
      word.example.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '全部' || word.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '全部' || word.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Handle custom word submission
  const handleSubmitCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newWord.trim() || !newTranslation.trim()) {
      setFormError('單字名稱與中文註釋為必填欄位！');
      return;
    }

    onAddCustomWord({
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || '/no phonetic/',
      translation: newTranslation.trim(),
      example: newExample.trim() || 'No example sentence loaded.',
      exampleTranslation: newExampleTranslation.trim() || '尚無例句翻譯。',
      category: newCategory,
      difficulty: newDifficulty
    });

    // Reset Form
    setNewWord('');
    setNewPhonetic('');
    setNewTranslation('');
    setNewExample('');
    setNewExampleTranslation('');
    setNewCategory('商務英語');
    setNewDifficulty('Intermediate');
    setIsAddModalOpen(false);
  };

  return (
    <div id="word-bank-container" className="space-y-6">
      
      {/* Title & Add Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">系統核心單字庫</h2>
          <p className="text-xs text-gray-400">研讀、發音、切換學習狀態並打造自訂專屬單字卡</p>
        </div>
        
        <button
          id="bank-add-custom-word-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition-colors shrink-0 w-max"
        >
          <Plus className="w-4 h-4" /> 新增自訂字彙
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3.5">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            id="word-bank-search"
            type="text"
            placeholder="搜尋單字、英文例句或中文翻譯..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500">主題分類:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(category => (
              <button
                id={`filter-category-${category}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter group */}
        <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-50">
          
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500">難易度:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map(difficulty => (
              <button
                id={`filter-difficulty-${difficulty}`}
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {difficulty === '全部' ? '全部級別' : difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocabulary Cards grid list */}
      {filteredWords.length > 0 ? (
        <div id="word-bank-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWords.map((word) => {
            const prog = getWordProgress(word.id);
            return (
              <div 
                key={word.id}
                id={`word-card-${word.id}`}
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Metadata and Pronunciation, Favorites */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100/30">
                        {word.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        word.difficulty === 'Elementary' ? 'bg-emerald-50 text-emerald-800' :
                        word.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-800' :
                        'bg-red-50 text-red-800'
                      }`}>
                        {word.difficulty}
                      </span>
                      {word.isCustom && (
                        <span className="text-[9px] bg-teal-50 text-teal-700 font-mono font-medium px-1.5 py-0.5 rounded-md border border-teal-100">
                          自訂
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSpeak(word.word)}
                        className="p-1 px-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="播放美式發音"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button
                        id={`btn-star-${word.id}`}
                        onClick={() => onToggleFavorite(word.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          prog.isFavorite 
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                            : 'text-gray-300 hover:text-amber-500 hover:bg-gray-50'
                        }`}
                        title={prog.isFavorite ? '取消最愛' : '加入最愛'}
                      >
                        <Star className={`w-4.5 h-4.5 ${prog.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Body: Head Word & translation */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold text-gray-950 font-sans tracking-wide">{word.word}</h3>
                      <span className="text-xs text-gray-400 font-mono">{word.phonetic}</span>
                    </div>
                    <p className="text-sm font-semibold text-indigo-800 mt-1.5">{word.translation}</p>
                  </div>

                  {/* Sentence and Examples section */}
                  <div className="pt-3 border-t border-gray-50 space-y-1">
                    <p className="text-xs text-slate-800 font-medium italic leading-relaxed">
                      " {word.example} "
                    </p>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      {word.exampleTranslation}
                    </p>
                  </div>
                </div>

                {/* Bottom Interactive Status Controls */}
                <div className="mt-5 pt-3.5 border-t border-gray-100/80 flex items-center justify-between">
                  
                  {/* Status Indicator text badge */}
                  <div className="flex items-center gap-1.5">
                    {prog.status === 'mastered' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 font-sans">
                        <CheckCircle className="w-3.5 h-3.5" /> 已掌握
                      </span>
                    ) : prog.status === 'learning' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 font-sans">
                        <BookmarkCheck className="w-3.5 h-3.5" /> 學習中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-sans">
                        <Bookmark className="w-3.5 h-3.5" /> 未學習
                      </span>
                    )}
                  </div>

                  {/* Actions segmented dropdown/buttons */}
                  <div className="flex gap-1.5">
                    <button
                      id={`status-学习中-${word.id}`}
                      onClick={() => onUpdateProgress(word.id, 'learning')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        prog.status === 'learning'
                          ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      學習中
                    </button>
                    <button
                      id={`status-修心 mastered-${word.id}`}
                      onClick={() => onUpdateProgress(word.id, 'mastered')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        prog.status === 'mastered'
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      熟練掌握
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-600">無相符的英文單字</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            試著修改您的搜尋文字或選取「全部」主題與級別分類，以找到更多核心字彙。
          </p>
        </div>
      )}

      {/* Custom Add Word Modal */}
      {isAddModalOpen && (
        <div id="add-modal-overlay" className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">建立您的自訂英文單字</h3>
                <span className="text-[10px] text-slate-300">創建並記錄個人專屬單字卡</span>
              </div>
              <button 
                id="close-word-modal"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCustomWord} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">英文單字 *</label>
                  <input
                    id="add-word-input-word"
                    type="text"
                    required
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="例如: Innovate"
                    className="block w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">音標 (Phonetic)</label>
                  <input
                    id="add-word-input-phonetic"
                    type="text"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    placeholder="例: /ˈɪn.ə.veɪt/"
                    className="block w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">中文翻譯 *</label>
                <input
                  id="add-word-input-translation"
                  type="text"
                  required
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="例: 創新，變革"
                  className="block w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">主題分類</label>
                  <select
                    id="add-word-select-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full px-2.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  >
                    <option value="商務英語">商務英語</option>
                    <option value="日常英語">日常英語</option>
                    <option value="旅遊英語">旅遊英語</option>
                    <option value="科技英文">科技英文</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">難易度</label>
                  <select
                    id="add-word-select-difficulty"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="block w-full px-2.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  >
                    <option value="Elementary">Elementary (初級)</option>
                    <option value="Intermediate">Intermediate (中級)</option>
                    <option value="Advanced">Advanced (高級)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">例句 (English Example)</label>
                <textarea
                  id="add-word-input-example"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="We must innovate to stay ahead of the competition."
                  rows={2}
                  className="block w-full px-3 py-2 text-xs bg-gray-55 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">例句翻譯 (Example Translation)</label>
                <textarea
                  id="add-word-input-examplephrase"
                  value={newExampleTranslation}
                  onChange={(e) => setNewExampleTranslation(e.target.value)}
                  placeholder="我們必須創新以保持競爭優勢。"
                  rows={2}
                  className="block w-full px-3 py-2 text-xs bg-gray-55 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-gray-55">
                <button
                  type="button"
                  id="add-word-cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  id="add-word-submit-btn"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-150"
                >
                  建立並加入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
