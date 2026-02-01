
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Moon, Sun, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const navigate = useNavigate();
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
    <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 active:scale-90 transition-all border border-gray-100/50 dark:border-slate-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white truncate max-w-[140px] md:max-w-none leading-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100/50 dark:border-slate-800 transition-all active:scale-95"
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
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100/50 dark:border-slate-800 font-bold text-xs transition-all active:scale-95"
          >
            {language}
            <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-20 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[60]">
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
  );
};

export default TopBar;
