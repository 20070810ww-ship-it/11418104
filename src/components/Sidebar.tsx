import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Sparkles, 
  GraduationCap, 
  BarChart3, 
  X,
  UserCheck,
  BookMarked
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  masteredWordsCount: number;
  totalWordsCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  masteredWordsCount,
  totalWordsCount
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '學習概覽', icon: LayoutDashboard, description: '每日進度與快捷導航' },
    { id: 'bank', label: '核心單字庫', icon: Database, description: '分類探索與自建單字' },
    { id: 'flashcards', label: '互動閃卡', icon: Sparkles, description: '翻轉字卡，高效記憶' },
    { id: 'quiz', label: '隨堂英文測驗', icon: GraduationCap, description: '情境選擇與即時得分' },
    { id: 'stats', label: '學習數據庫', icon: BarChart3, description: '測驗歷史與各科掌握度' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close on mobile after selection
  };

  const progressPercentage = totalWordsCount > 0 
    ? Math.round((masteredWordsCount / totalWordsCount) * 100) 
    : 0;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-100 w-72 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-out z-50 flex flex-col border-r border-slate-850 h-screen`}
      >
        {/* Mobile Close Button */}
        <div className="flex lg:hidden items-center justify-between p-4 border-b border-slate-800">
          <span className="text-sm font-semibold text-slate-400">系統主選單</span>
          <button
            id="close-sidebar-btn"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Banner / Branding Title on Desktop/Side */}
        <div className="p-6 hidden lg:block border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono">
              Vocab Learning Main
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav id="nav-menu" className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-tab-${item.id}`}
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20 font-medium'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left">
                  <span className="block text-sm leading-tight">{item.label}</span>
                  <span className={`block text-[11px] font-normal mt-0.5 ${
                    isActive ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Sidebar Bottom Mastery Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-750">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">目前詞彙掌控進度</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span>掌握: {masteredWordsCount} 個 / 總數: {totalWordsCount}</span>
              <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
