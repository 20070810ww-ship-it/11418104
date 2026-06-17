import React from 'react';
import { 
  Flame, 
  BookMarked, 
  CheckCircle,
  Clock, 
  Compass, 
  ArrowRight, 
  PlusCircle, 
  Lightbulb, 
  Award,
  Sparkles
} from 'lucide-react';
import { VocabularyWord, WordProgress } from '../types';

interface DashboardProps {
  currentUser: { name: string };
  words: VocabularyWord[];
  progress: WordProgress[];
  streak: number;
  setActiveTab: (tab: string) => void;
  onOpenAddCustomWord: () => void;
}

export default function Dashboard({
  currentUser,
  words,
  progress,
  streak,
  setActiveTab,
  onOpenAddCustomWord
}: DashboardProps) {
  // Count stats
  const totalCount = words.length;

  const masteredCount = progress.filter(p => p.status === 'mastered').length;
  const learningCount = progress.filter(p => p.status === 'learning').length;
  const newCount = totalCount - masteredCount - learningCount;

  const masteredPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
  const learningPercent = totalCount > 0 ? Math.round((learningCount / totalCount) * 100) : 0;

  // Recommended words: Pick 3 words that are not mastered
  const masteredIds = new Set(progress.filter(p => p.status === 'mastered').map(p => p.wordId));
  const studyRecommendations = words
    .filter(w => !masteredIds.has(w.id))
    .slice(0, 3);

  // If we don't have enough recommendations, pick any 3 words
  const displayRecommendations = studyRecommendations.length > 0 
    ? studyRecommendations 
    : words.slice(0, 3);

  // Get 3 recently mastered words
  const masteredWords = progress
    .filter(p => p.status === 'mastered')
    .map(p => words.find(w => w.id === p.wordId))
    .filter((w): w is VocabularyWord => !!w)
    .slice(0, 3);

  return (
    <div id="dashboard-container" className="space-y-6">
      {/* Welcome Banner Card */}
      <div 
        id="dash-welcome-banner"
        className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-800/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl" />
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 bg-indigo-505/15 text-indigo-300 text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full w-max mb-3.5 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>個人學習主控台</span>
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-bold tracking-tight mb-2">
            哈囉，{currentUser.name}！
          </h1>
          <p className="text-sm text-indigo-200/90 leading-relaxed">
            今天也是充實詞彙量的好日子。學習系統已為您備妥全新英文閃卡與即時測驗，快來突破英文瓶頸吧！
          </p>
        </div>
      </div>

      {/* Bento Grid layout for statistics */}
      <div id="stats-bento-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Ring Progress Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 block">
            詞彙掌控總進度
          </span>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Ring background and foreground progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                className="stroke-gray-100 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                className="stroke-indigo-600 fill-none transition-all duration-500"
                strokeWidth="10"
                strokeDasharray={326.7}
                strokeDashoffset={326.7 - (326.7 * masteredPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2.5xl font-extrabold text-slate-900 font-mono">{masteredPercent}%</span>
              <span className="text-[11px] text-gray-500 mt-0.5">已完美掌握</span>
            </div>
          </div>

          <div className="mt-5 text-sm text-gray-500 flex gap-4 font-mono">
            <span>掌握: <strong className="text-indigo-600">{masteredCount}</strong></span>
            <span>/</span>
            <span>總數: <strong>{totalCount}</strong></span>
          </div>
        </div>

        {/* Detailed Stats Cards: Word Breakdown */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-4">
              單字狀態分佈
            </span>
            <div className="space-y-4">
              {/* Mastered progress slider bar */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                    已掌握單字
                  </span>
                  <span className="font-mono">{masteredCount} 個 ({masteredPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${masteredPercent}%` }} />
                </div>
              </div>

              {/* Learning progress slider bar */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    學習中單字
                  </span>
                  <span className="font-mono">{learningCount} 個 ({learningPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${learningPercent}%` }} />
                </div>
              </div>

              {/* New words progress bar placeholder */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                    未激活新單字
                  </span>
                  <span className="font-mono">{newCount} 個</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-300 h-full rounded-full" style={{ width: `${totalCount > 0 ? (newCount/totalCount)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>自訂單字數：{words.filter(w => w.isCustom).length} 個</span>
            <button 
              id="dash-add-custom-btn"
              onClick={onOpenAddCustomWord}
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> 建立新詞彙
            </button>
          </div>
        </div>

        {/* Motivational Streak Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                學習自律狀態
              </span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">{streak}</span>
                <span className="text-sm font-medium text-slate-500">天連續</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                研究顯示每日複習 5 個單字，一個月即可掌握 150 個核心單字！堅持每天登入複習，累積不中斷。
              </p>
            </div>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100/50 flex items-start gap-2.5 text-xs text-amber-800">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>小提示：</strong>完成一次完整英文自測，或在閃卡單元點擊「學會了」將有效刷新今日進度！</span>
          </div>
        </div>
      </div>

      {/* Recommendations & Recent Masteries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Words Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              今日推薦學習詞彙
            </h3>
            
            <div className="space-y-3">
              {displayRecommendations.map((word) => (
                <div 
                  key={word.id} 
                  className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 font-sans">{word.word}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-mono">
                        {word.phonetic}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{word.translation}</p>
                  </div>
                  
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    word.difficulty === 'Elementary' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    word.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {word.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            id="dash-learn-recoms-btn"
            onClick={() => setActiveTab('bank')}
            className="w-full mt-5 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            探索核心單字庫 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recently Mastered Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              近期熟練掌握單字
            </h3>

            {masteredWords.length > 0 ? (
              <div className="space-y-3">
                {masteredWords.map((word) => (
                  <div 
                    key={word.id} 
                    className="p-3.5 rounded-2xl bg-emerald-50/20 border border-emerald-100/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-800 font-sans">{word.word}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-mono">
                          {word.phonetic}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{word.example}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <span className="text-xs text-gray-400 block px-4">尚無掌握的單字。</span>
                <span className="text-[11px] text-gray-400 mt-1 block px-4">
                  在「核心單字庫」或「互動閃卡」中，將您已熟悉的單字標記為已掌握吧！
                </span>
              </div>
            )}
          </div>

          <button
            id="dash-start-flashcards"
            onClick={() => setActiveTab('flashcards')}
            className="w-full mt-5 inline-flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            開啟閃卡高效訓練 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
