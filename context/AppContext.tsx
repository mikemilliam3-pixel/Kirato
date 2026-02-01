
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Language, Theme } from '../types';
import { translations } from '../i18n/translations';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('app-language') as Language) || 'UZ'
  );
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem('app-theme') as Theme) || 'light'
  );

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleTheme = () => setThemeState(prev => prev === 'light' ? 'dark' : 'light');

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else {
        return path;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <AppContext.Provider value={{ language, theme, setLanguage, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
