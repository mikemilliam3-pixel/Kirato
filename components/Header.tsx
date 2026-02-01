
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { Language } from '../types';

const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-transparent dark:border-slate-900">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            K
          </div>
          <div className="flex flex-col">
            <h1 className="text-blue-600 font-bold text-lg leading-tight">
              {t('appName')}
            </h1>
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
              {t('appSubtitle')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 font-bold text-xs transition-all active:scale-95"
            >
              {language}
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-20 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                {(['UZ', 'RU', 'EN'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                      language === lang ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
