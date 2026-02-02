
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Moon, Sun, ChevronDown, Search, Bell, 
  User, Settings, LogOut, Menu, Globe, LogIn, Coins
} from 'lucide-react';
import { Language, UserProfile } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, setLanguage, t, unreadNotifications, isLoggedIn, login, logout, credits } = useApp();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem('kirato-user-profile');
      if (stored && isLoggedIn) {
        setUserProfile(JSON.parse(stored));
      } else if (isLoggedIn) {
        const mockProfile = {
          fullName: 'John Doe',
          username: 'johndoe',
          email: 'john.doe@kirato.ai',
          phone: '+998 90 123 45 67'
        };
        setUserProfile(mockProfile);
      } else {
        setUserProfile(null);
      }
    };
    loadProfile();
    window.addEventListener('profile-updated', loadProfile);
    window.addEventListener('auth-change', loadProfile);
    return () => {
      window.removeEventListener('profile-updated', loadProfile);
      window.removeEventListener('auth-change', loadProfile);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) setIsLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    login();
    navigate('/');
  };

  const menuAction = (path: string) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 shrink-0">
      {/* Left: Mobile Toggle + Brand */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <Menu size={22} />
        </button>
        <div className="hidden xs:flex flex-col cursor-pointer" onClick={() => navigate('/')}>
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[2px] leading-tight">Kirato</h2>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{t('appSubtitle')}</span>
        </div>
      </div>

      {/* Center: Global Search - Responsive width */}
      <div className={`
        flex items-center gap-2 md:gap-3 px-3 md:px-4 h-11 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800
        transition-all duration-300 flex-1 max-w-md mx-2 md:mx-8
        ${searchFocused ? 'ring-2 ring-blue-500/20 border-blue-500/50 bg-white dark:bg-slate-900' : ''}
      `}>
        <Search size={18} className="text-slate-400 shrink-0" />
        <input 
          type="text" 
          placeholder={t('common.search') || "Search..."} 
          className="bg-transparent border-none text-[13px] font-bold w-full focus:ring-0 placeholder:text-gray-400"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-sm shrink-0">
          <span className="font-mono">⌘</span>K
        </div>
      </div>

      {/* Right: Action Group */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* Credits Badge */}
        <button 
          onClick={() => navigate('/billing')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 active:scale-95 transition-all"
        >
          <Coins size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('common.credits')}:</span>
          <span className="text-[11px] font-black">{credits}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 transition-all active:scale-95 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-yellow-400" />}
        </button>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 font-black text-[11px] transition-all active:scale-95 text-slate-600 dark:text-slate-400"
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

        {/* Auth Controlled Profile Dropdown */}
        {isLoggedIn ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 md:p-1.5 md:pr-3 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 active:scale-95 transition-all group relative"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                {userProfile?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'}
              </div>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-900">
                  {unreadNotifications}
                </span>
              )}
              <ChevronDown className={`hidden md:block w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <div className="fixed md:absolute right-4 md:right-0 mt-3 w-[calc(100vw-2rem)] md:w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-2 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[100]">
                <div className="px-4 py-4 border-b border-gray-50 dark:border-slate-800 mb-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{userProfile?.fullName || 'John Doe'}</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">@{userProfile?.username || 'johndoe'}</p>
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={() => menuAction('/notifications')}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-blue-600" />
                      <span>{t('common.notifications')}</span>
                    </div>
                    {unreadNotifications > 0 && (
                      <span className="w-5 h-5 bg-rose-500 text-white text-[9px] flex items-center justify-center rounded-full font-black">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => menuAction('/profile')}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User size={18} className="text-blue-600" />
                    <span>My Profile</span>
                  </button>

                  <button 
                    onClick={() => menuAction('/settings')}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings size={18} className="text-blue-600" />
                    <span>Account Settings</span>
                  </button>
                </div>
                
                <div className="h-px bg-gray-50 dark:border-slate-800 my-2" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogin}
              className="hidden sm:flex px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all active:scale-95"
            >
              {t('common.signIn')}
            </button>
            <button 
              onClick={handleLogin}
              className="flex px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <LogIn size={14} className="sm:hidden" />
              <span>{t('common.signUp')}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;