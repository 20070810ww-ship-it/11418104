import React, { useState, useEffect } from 'react';
import { User, Lock, UserPlus, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prepopulate guest account on load if not existing
  useEffect(() => {
    const existingUsers: UserType[] = JSON.parse(localStorage.getItem('vocab_users') || '[]');
    const clientUserExists = existingUsers.some(u => u.username === 'guest');
    if (!clientUserExists) {
      const guestUser: UserType = {
        id: 'user_guest',
        username: 'guest',
        password: 'password123',
        name: '體驗訪客',
        createdAt: new Date().toISOString()
      };
      existingUsers.push(guestUser);
      localStorage.setItem('vocab_users', JSON.stringify(existingUsers));
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('請填寫所有必要欄位！');
      return;
    }

    const savedUsers: UserType[] = JSON.parse(localStorage.getItem('vocab_users') || '[]');

    if (isLoginTab) {
      // Login Process
      const user = savedUsers.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!user) {
        setError('找不到該使用者帳號，您可以註冊一個新帳號！');
        return;
      }

      if (user.password !== password) {
        setError('密碼不正確，請再試一次。');
        return;
      }

      // Successful Login
      onLoginSuccess(user);
    } else {
      // Register Process
      if (!name.trim()) {
        setError('請提供您的顯示姓名。');
        return;
      }

      const userExists = savedUsers.some(
        u => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (userExists) {
        setError('該帳號使用者名稱已被註冊。');
        return;
      }

      const newUser: UserType = {
        id: 'user_' + Date.now(),
        username: username.trim(),
        password: password,
        name: name.trim(),
        createdAt: new Date().toISOString()
      };

      savedUsers.push(newUser);
      localStorage.setItem('vocab_users', JSON.stringify(savedUsers));

      setSuccess('註冊成功！已為您自動登入...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1000);
    }
  };

  const handleGuestLogin = () => {
    const savedUsers: UserType[] = JSON.parse(localStorage.getItem('vocab_users') || '[]');
    let guestUser = savedUsers.find(u => u.username === 'guest');
    if (!guestUser) {
      guestUser = {
        id: 'user_guest',
        username: 'guest',
        password: 'password123',
        name: '體驗訪客',
        createdAt: new Date().toISOString()
      };
    }
    onLoginSuccess(guestUser);
  };

  return (
    <div id="auth-page-container" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background grids */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-80" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          歡迎使用單字學習系統
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          高效學習英文單字，輕鬆打造自主詞彙量庫
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-100">
          
          {/* Tab Switcher Headers */}
          <div className="flex border-b border-gray-100 pb-5 mb-6">
            <button
              id="auth-tab-login"
              type="button"
              className={`flex-1 text-center pb-3 text-sm font-semibold border-b-2 transition-all ${
                isLoginTab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => {
                setIsLoginTab(true);
                setError('');
                setSuccess('');
              }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <LogIn className="w-4 h-4" />
                帳密登入
              </div>
            </button>
            <button
              id="auth-tab-register"
              type="button"
              className={`flex-1 text-center pb-3 text-sm font-semibold border-b-2 transition-all ${
                !isLoginTab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => {
                setIsLoginTab(false);
                setError('');
                setSuccess('');
              }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                註冊帳號
              </div>
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div id="auth-error-msg" className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div id="auth-success-msg" className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
              <span>{success}</span>
            </div>
          )}

          {/* Auth form */}
          <form id="auth-form" onSubmit={handleAuthSubmit} className="space-y-5">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  顯示姓名 / 暱稱
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="reg-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：張小明"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                使用者帳號 (Username)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="auth-input-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="請輸入英文或數字帳號"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                密碼 (Password)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="auth-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg hover:shadow-indigo-100"
            >
              {isLoginTab ? '安全登入系統' : '註冊帳號並登入'}
            </button>
          </form>

          {/* Quick guest bypass */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 font-mono">
              <span className="bg-white px-3">或</span>
            </div>
          </div>

          <button
            id="auth-guest-btn"
            type="button"
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-150"
          >
            <span>✨ 訪客快速通道 免註冊體驗 </span>
          </button>
        </div>
      </div>
    </div>
  );
}
