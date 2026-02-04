import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Moon, Sun, ChevronDown, Bell, 
  User as UserIcon, Settings, LogOut, Menu, LogIn, Coins, Crown
} from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function formatNameFromEmail(email: string): string {
  if (!email) return 'User';
  const namePart = email.split('@')[0];
  return namePart
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, setLanguage, t, unreadNotifications, isLoggedIn, openAuth, logout, credits, user } = useApp();
  const navigate = useNavigate();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const userData = useMemo(() => {
    if (!user) return null;
    const name = user.displayName || formatNameFromEmail(user.email || '');
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return { name, email: user.email, initials };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) setIsLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 shrink-0 w-full">
      {/* Left: Mobile Toggle + Brand */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all shrink-0"
        >
          <Menu size={22} />
        </button>
        
        {/* Branding Block: Mobile & Tablet Only */}
        <div 
          onClick={() => navigate('/')}
          className="flex flex-col cursor-pointer lg:hidden min-w-0"
        >
          <span className="text-sm sm:text-base font-black text-blue-600 leading-none tracking-tight truncate">
            Kirato AI
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[2px] mt-0.5 leading-none truncate">
            Assistant
          </span>
        </div>
      </div>

      {/* Right: Action Group */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
        {/* Credits Badge - Header (Clickable Shortcut) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/billing');
          }}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all shadow-sm"
          role="button"
          tabIndex={0}
        >
          <Coins size={14} className="sm:size-[16px]" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">{t('common.credits')}:</span>
          <span className="text-[11px] font-black">{credits}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex p-2 sm:p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 transition-all active:scale-95 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-yellow-400" />}
        </button>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 px-2 py-2 sm:py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 font-black text-[10px] sm:text-[11px] transition-all active:scale-95 text-slate-600 dark:text-slate-400"
          >
            {language}
            <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-3 w-24 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
              {(['UZ', 'RU', 'EN'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                  className={`w-full px-4 py-3 text-left text-[11px] font-black hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                    language === lang ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-500'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        {isLoggedIn && userData ? (
          <div className="relative hidden lg:block" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 active:scale-95 transition-all group relative"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                {userData.initials}
              </div>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-900">
                  {unreadNotifications}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-2 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[100]">
                <div className="px-4 py-4 border-b border-gray-50 dark:border-slate-800 mb-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">{userData.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate mb-3">{userData.email}</p>
                  
                  {/* Credits Summary Row - Display Only (as per previous strict rules) */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-blue-600 cursor-default select-none">
                    <Coins size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('common.credits')}:</span>
                    <span className="text-[11px] font-black">{credits}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={() => { setIsProfileOpen(false); navigate('/notifications'); }}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-blue-600" />
                      <span>{t('common.notifications')}</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon size={18} className="text-blue-600" />
                    <span>My Profile</span>
                  </button>

                  <button 
                    onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings size={18} className="text-blue-600" />
                    <span>Account Settings</span>
                  </button>

                  {/* Upgrade Menu Item - Placeholder Behavior (Positioned between Settings and Logout) */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsProfileOpen(false);
                      alert(`${t('nav.upgrade')}: ${t('common.comingSoon')}`);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Crown size={18} className="text-amber-500" />
                    <span>{t('nav.upgrade')}</span>
                  </button>
                </div>
                
                <div className="h-px bg-gray-50 dark:border-slate-800 my-2" />
                
                <button 
                  onClick={() => { setIsProfileOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => openAuth('signup')}
            className="flex px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <LogIn size={14} className="shrink-0" />
            <span className="hidden xs:inline">{t('common.signUp')}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;