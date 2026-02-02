import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Language, Theme } from '../types';
import { translations } from '../i18n/translations';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('app-language');
      return (stored as Language) || 'UZ';
    } catch {
      return 'UZ';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('app-theme');
      return (stored as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app-language', language);
    } catch (e) {
      console.warn("Storage restricted:", e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('app-theme', theme);
    } catch (e) {
      console.warn("Storage restricted:", e);
    }
    
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