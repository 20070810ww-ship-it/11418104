import React from 'react';
import { BookOpen, LogOut, Menu, User, Flame, TrendingUp } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  streak: number;
  masteredCount: number;
  totalCount: number;
}

export default function Navbar({
  currentUser,
  onLogout,
  onToggleSidebar,
  streak,
  masteredCount,
  totalCount
}: NavbarProps) {
  return (
    <header 
      id="app-navbar" 
      className="bg-white border-b border-gray-100 sticky top-0 z-40 transition-all duration-200"
    >
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand & Menu */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-50 lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-100">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-950 tracking-tight block">單字學習系統</span>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">VocaLearn Engine</span>
            </div>
          </div>
        </div>

        {/* Right Side: Logged User info and Stats */}
        {currentUser && (
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Streak Counter */}
            <div 
              id="streak-indicator"
              className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100/60 transition-transform duration-200 hover:scale-105"
              title="連續學習天數狀態"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span className="text-xs font-semibold font-mono">{streak} 天連續</span>
            </div>

            {/* Quick Completion badge */}
            <div 
              id="progress-summary-badge" 
              className="hidden md:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100/60"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">
                掌握度 {totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0}%
              </span>
            </div>

            {/* User Dropdown Profile segment */}
            <div className="flex items-center gap-3 border-l border-gray-100 pl-4 sm:pl-6">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-medium text-gray-800">{currentUser.name}</span>
                <span className="block text-xs text-gray-400 font-mono">@{currentUser.username}</span>
              </div>
              
              <div 
                id="user-avatar"
                className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                title={`${currentUser.name} 的個人設定`}
              >
                <User className="w-4.5 h-4.5" />
              </div>

              <button
                id="logout-btn"
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 ml-1"
                title="登出系統"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
