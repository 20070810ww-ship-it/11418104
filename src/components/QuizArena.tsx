import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  XSquare, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { VocabularyWord } from '../types';
import { CATEGORIES } from '../data';

interface QuizQuestion {
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
}

interface QuizArenaProps {
  words: VocabularyWord[];
  onAddScoreRecord: (score: number, total: number, category: string) => void;
}

export default function QuizArena({ words, onAddScoreRecord }: QuizArenaProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Auto-speak word on new question
  useEffect(() => {
    if (quizStarted && !quizFinished && questions[currentQuestionIndex]) {
      const activeWord = questions[currentQuestionIndex].word.word;
      // Delay slightly for transition safety
      const timer = setTimeout(() => {
        handleSpeak(activeWord);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [quizStarted, quizFinished, currentQuestionIndex, questions]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate 5 random questions
  const startNewQuiz = () => {
    // Filter source words
    const sourceWords = words.filter(
      w => selectedCategory === '全部' || w.category === selectedCategory
    );

    if (sourceWords.length < 2) {
      alert('詞彙庫中相符的單字太少，請添加更多自訂單字或選取「全部」以開始測驗。');
      return;
    }

    const quizLength = Math.min(5, sourceWords.length);
    // Shuffle source words
    const shuffledSource = [...sourceWords].sort(() => 0.5 - Math.random());
    const selectedQuizWords = shuffledSource.slice(0, quizLength);

    const generatedQuestions: QuizQuestion[] = selectedQuizWords.map(targetWord => {
      // Find incorrect options
      const distractors = words
        .filter(w => w.id !== targetWord.id)
        .map(w => w.translation);
      
      const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
      const selectedDistractors = shuffledDistractors.slice(0, 3);
      
      // Combine target translation and distractors
      const options = [targetWord.translation, ...selectedDistractors].sort(() => 0.5 - Math.random());

      return {
        word: targetWord,
        options,
        correctAnswer: targetWord.translation
      };
    });

    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Finished
      setQuizFinished(true);
      onAddScoreRecord(score, questions.length, selectedCategory);
    }
  };

  return (
    <div id="quiz-arena-container" className="max-w-2xl mx-auto space-y-6">
      
      {/* Title block */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">隨堂英文自測</h2>
        <p className="text-xs text-gray-500 mt-0.5">多重情境關卡，學好英文單字即刻檢驗成果</p>
      </div>

      {!quizStarted ? (
        /* Configuration Screen BEFORE starting */
        <div id="quiz-setup-card" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
            <GraduationCap className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">學科考題配置</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              每次測驗系統將隨機產生 5 道學門題目。您可自訂複習特定英文分類，累積並儲存進度。
            </p>
          </div>

          {/* Selector */}
          <div className="max-w-xs mx-auto space-y-2">
            <label className="block text-xs font-semibold text-gray-400 text-left uppercase tracking-wider">
              篩選自測學門
            </label>
            <select
              id="quiz-setup-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full bg-slate-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium text-slate-800"
            >
              <option value="全部">全部主題 綜合測驗</option>
              {CATEGORIES.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            id="start-quiz-btn"
            onClick={startNewQuiz}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-150"
          >
            開啟自律英文自測 ⚡
          </button>
        </div>
      ) : quizFinished ? (
        /* Final Score Result summary view */
        <div id="quiz-result-card" className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-amber-50 rounded-full mx-auto flex items-center justify-center border-4 border-amber-100/50">
            <Trophy className="w-10 h-10 text-amber-500 fill-amber-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">測驗已圓滿結束！</h3>
            <p className="text-xs text-gray-400">
              主題學門：<span className="font-semibold text-indigo-700">{selectedCategory}</span>
            </p>
          </div>

          {/* Score Circle Progress */}
          <div className="bg-slate-50 border border-slate-100/50 py-5 rounded-2xl max-w-sm mx-auto">
            <span className="text-xs text-gray-400 block font-medium">答對題數得分率</span>
            <div className="flex items-baseline justify-center gap-1.5 mt-2.5">
              <span className="text-4xl font-extrabold text-indigo-600 font-mono">{score}</span>
              <span className="text-xl text-gray-400">/</span>
              <span className="text-xl font-bold text-gray-500 font-mono">{questions.length}</span>
            </div>
            
            <span className="text-xs font-semibold text-slate-700 block mt-3 px-6">
              {score === questions.length ? '🏆 完美！卓越的詞彙大師！' :
               score >= 3 ? '⭐ 太棒了！請繼續保持卓越' :
               '📚 再接再厲！多利用互動閃卡複習吧'}
            </span>
          </div>

          <div className="flex gap-4 max-w-xs mx-auto">
            <button
              onClick={() => setQuizStarted(false)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              更換測驗主題
            </button>
            <button
              onClick={startNewQuiz}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-700 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 再測一遍
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ ACTIVE SCREEN */
        <div id="quiz-question-card" className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Progress and score tracker top headers */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                {selectedCategory} 專屬測驗
              </span>
              <span className="text-xs text-gray-600 font-mono font-bold block">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            
            {/* Real-time score indicator */}
            <div className="bg-indigo-50/60 border border-indigo-100/40 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
              答對題數: {score}
            </div>
          </div>

          {/* The question text area card */}
          {questions[currentQuestionIndex] && (
            <div className="space-y-5">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center">
                  <button
                    onClick={() => handleSpeak(questions[currentQuestionIndex].word.word)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="播報美式讀音"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <span className="text-2xs font-semibold text-gray-400 uppercase tracking-widest font-mono">請選出相對應的正確中文解釋</span>
                <h3 className="text-2.5xl sm:text-3.5xl font-extrabold text-indigo-950 font-sans tracking-wide mt-2">
                  {questions[currentQuestionIndex].word.word}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  音標：{questions[currentQuestionIndex].word.phonetic}
                </p>

                {/* Optional sentence helper with hidden word */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200/80">
                  <span className="text-[10px] text-indigo-500 font-semibold block uppercase tracking-wider mb-1">
                    例句語境線索
                  </span>
                  <p className="text-xs text-slate-650 italic max-w-md mx-auto leading-relaxed">
                    " {questions[currentQuestionIndex].word.example.replace(
                      new RegExp(questions[currentQuestionIndex].word.word, 'gi'),
                      '_______'
                    )} "
                  </p>
                </div>
              </div>

              {/* Multiple Choice Grid options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isCurCorrect = option === questions[currentQuestionIndex].correctAnswer;
                  const isSelected = option === selectedAnswer;

                  // Conditional classes depending on status
                  let optionClass = "bg-white border-gray-200 hover:bg-gray-50 text-slate-850";
                  let badgeClass = "bg-gray-100 text-gray-700";

                  if (isAnswered) {
                    if (isCurCorrect) {
                      // Correct option turns glowing emerald green
                      optionClass = "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold";
                      badgeClass = "bg-emerald-500 text-white";
                    } else if (isSelected) {
                      // Selected incorrect option turns red
                      optionClass = "bg-rose-50 border-rose-300 text-rose-800 font-semibold";
                      badgeClass = "bg-rose-500 text-white";
                    } else {
                      // Other option dimmed
                      optionClass = "bg-white border-gray-100 text-gray-300 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${letter}`}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isAnswered}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-xs text-left transition-all ${optionClass}`}
                    >
                      <span className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-xs shrink-0 ${badgeClass}`}>
                        {letter}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Show immediate answer explanation details */}
              {isAnswered && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-bottom-2 duration-150">
                  <div className="flex gap-2 text-xs">
                    {selectedAnswer === questions[currentQuestionIndex].correctAnswer ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 答對了！
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold flex items-center gap-1.5 shrink-0">
                        <XSquare className="w-4 h-4 text-rose-500" /> 答錯了...
                      </span>
                    )}

                    <p className="text-gray-500 leading-normal">
                      正確答案為<strong>「{questions[currentQuestionIndex].correctAnswer}」</strong>。例句意思：{questions[currentQuestionIndex].word.exampleTranslation}
                    </p>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <button
                  id="quiz-next-question-btn"
                  onClick={handleNextQuestion}
                  className="w-full inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  {currentQuestionIndex === questions.length - 1 ? '完成測驗並結算' : '下一道考題'} 
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
