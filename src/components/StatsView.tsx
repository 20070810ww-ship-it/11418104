import React from 'react';
import { 
  Trophy, 
  Trash2, 
  GraduationCap, 
  Calendar, 
  Award, 
  Compass, 
  Layers, 
  BookmarkCheck, 
  HeartCrack,
  AlertCircle
} from 'lucide-react';
import { QuizRecord, VocabularyWord, WordProgress } from '../types';

interface StatsViewProps {
  quizRecords: QuizRecord[];
  words: VocabularyWord[];
  progress: WordProgress[];
  onDeleteCustomWord: (wordId: string) => void;
  onClearQuizHistory: () => void;
}

export default function StatsView({
  quizRecords,
  words,
  progress,
  onDeleteCustomWord,
  onClearQuizHistory
}: StatsViewProps) {
  
  // Custom words lists
  const customWords = words.filter(w => w.isCustom);

  // Group mastery counts by category
  const categoriesList = ['商務英語', '日常英語', '旅遊英語', '科技英文'];
  const categoryMastery = categoriesList.map(cat => {
    const totalInCat = words.filter(w => w.category === cat).length;
    const masteredInCat = progress.filter(p => {
      if (p.status !== 'mastered') return false;
      const w = words.find(word => word.id === p.wordId);
      return w ? w.category === cat : false;
    }).length;

    const percent = totalInCat > 0 ? Math.round((masteredInCat / totalInCat) * 100) : 0;
    return {
      cat,
      total: totalInCat,
      mastered: masteredInCat,
      percent
    };
  });

  // Calculate generic high achievements
  const hasMasteredAny = progress.some(p => p.status === 'mastered');
  const hasPerfectQuiz = quizRecords.some(r => r.score === r.total && r.total > 0);
  const hasCustomWord = customWords.length > 0;
  const hasQuizzesTaken = quizRecords.length >= 3;

  const achievements = [
    {
      id: 'first_login',
      title: '啟航冒險家',
      desc: '首次登入單字學習系統',
      unlocked: true,
      icon: Compass,
      color: 'text-indigo-650 bg-indigo-50 border-indigo-100'
    },
    {
      id: 'master_one',
      title: '開始起飛',
      desc: '完全熟記並學會第 1 個英文單字',
      unlocked: hasMasteredAny,
      icon: BookmarkCheck,
      color: hasMasteredAny ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-gray-400 bg-gray-100/50 border-gray-150'
    },
    {
      id: 'perfect_quiz',
      title: '滿分學神',
      desc: '在隨堂英文測驗中獲得滿分成績',
      unlocked: hasPerfectQuiz,
      icon: Trophy,
      color: hasPerfectQuiz ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-gray-400 bg-gray-100/50 border-gray-150'
    },
    {
      id: 'create_word',
      title: '開路工程師',
      desc: '建立您的第 1 個自訂專屬單字',
      unlocked: hasCustomWord,
      icon: Award,
      color: hasCustomWord ? 'text-purple-700 bg-purple-50 border-purple-100' : 'text-gray-400 bg-gray-100/50 border-gray-150'
    },
    {
      id: 'marathon_quiz',
      title: '知識狂熱者',
      desc: '累計累積進行 3 次以上隨堂測驗',
      unlocked: hasQuizzesTaken,
      icon: Layers,
      color: hasQuizzesTaken ? 'text-cyan-700 bg-cyan-50 border-cyan-100' : 'text-gray-400 bg-gray-100/50 border-gray-150'
    }
  ];

  return (
    <div id="stats-view-container" className="space-y-6">
      
      {/* Subject categories mastery breakdown grids */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-indigo-600" />
          主題難度分佈掌握度
        </h3>

        <div id="mastery-categories-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryMastery.map(({ cat, total, mastered, percent }) => (
            <div 
              key={cat} 
              className="bg-white border border-gray-105 rounded-2xl p-4 shadow-xs"
            >
              <span className="text-xs font-semibold text-gray-500 block">{cat}</span>
              
              <div className="flex items-baseline gap-1 mt-1.5 mb-2">
                <span className="text-lg font-bold text-slate-900 font-mono">{percent}%</span>
                <span className="text-xs text-slate-400 font-mono">({mastered}/{total} 個)</span>
              </div>

              {/* Progress Slider track bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-650 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Achievements Arena and Quiz log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Achievements Segment */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              成就英豪榜
            </h3>

            <div className="space-y-3.5">
              {achievements.map((ach) => {
                const Icon = ach.icon;
                return (
                  <div 
                    key={ach.id} 
                    className={`p-3 rounded-2xl border flex items-start gap-3 transition-opacity duration-200 ${
                      ach.unlocked ? 'opacity-100' : 'opacity-55'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 border ${ach.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{ach.title}</span>
                      <span className="block text-[11px] text-gray-500 mt-0.5">{ach.desc}</span>
                      <span className={`inline-block text-[10px] uppercase font-bold mt-1 ${
                        ach.unlocked ? 'text-indigo-600' : 'text-gray-400 font-mono'
                      }`}>
                        {ach.unlocked ? '✓ 已解鎖' : '未達成'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quiz History log table segment */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                隨堂英文測試記錄
              </h3>

              {quizRecords.length > 0 && (
                <button
                  id="clear-quiz-history-btn"
                  onClick={onClearQuizHistory}
                  className="text-gray-400 hover:text-red-500 text-[10px] font-semibold flex items-center gap-1"
                  title="清空所有測驗歷史"
                >
                  <HeartCrack className="w-3.5 h-3.5" /> 清空紀錄
                </button>
              )}
            </div>

            {quizRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                      <th className="py-2.5 px-3">日期時間</th>
                      <th className="py-2.5 px-3">自測主題</th>
                      <th className="py-2.5 px-3">得分題數</th>
                      <th className="py-2.5 px-3">掌握率</th>
                      <th className="py-2.5 px-3 text-right">績效等級</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50 text-xs">
                    {quizRecords.map((r, i) => {
                      const pct = Math.round((r.score / r.total) * 100);
                      return (
                        <tr key={r.id || i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3 text-gray-500 font-mono inline-flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {new Date(r.date).toLocaleDateString('zh-TW')}
                          </td>
                          <td className="py-2 px-3 text-slate-800 font-semibold">{r.category}測驗</td>
                          <td className="py-2 px-3 text-slate-700 font-mono font-medium">{r.score} / {r.total}</td>
                          <td className="py-2 px-3 text-indigo-700 font-mono font-bold">{pct}%</td>
                          <td className="py-2 px-3 text-right">
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              pct === 100 ? 'bg-amber-50 text-amber-700' :
                              pct >= 60 ? 'bg-indigo-50 text-indigo-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {pct === 100 ? '極其出色' : pct >= 60 ? '考核及格' : '需多練習'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <span className="text-xs text-gray-500 block font-semibold">尚無任何測驗歷史紀錄。</span>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  點擊左側選單的「隨堂自測」挑選主題考題，即可在此記錄答對率。
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Custom words catalog lists */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-indigo-650" />
          自訂英文單字儲存庫 ({customWords.length} 個)
        </h3>

        {customWords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customWords.map((word) => (
              <div 
                key={word.id} 
                className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-950 font-sans block">{word.word}</span>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{word.phonetic} - {word.translation}</span>
                  <span className="text-[9px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded-md mt-1.5 inline-block">
                    {word.category}
                  </span>
                </div>

                <button
                  id={`delete-custom-word-${word.id}`}
                  onClick={() => onDeleteCustomWord(word.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="刪除此自建單字"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50/40 rounded-2xl border border-dashed border-gray-200">
            <span className="text-xs text-gray-400 block font-medium">您目前尚無新增任何自訂單字。</span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              前往「核心單字庫」點擊「新增自訂字彙」按鈕，即可記錄您個人的客製化單字！
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
