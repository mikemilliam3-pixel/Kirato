import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Language, Theme } from '../types';
import { translations } from '../i18n/translations';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('kirato-lang');
      return (stored as Language) || 'EN';
    } catch {
      return 'EN';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('kirato-theme');
      return (stored as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    localStorage.setItem('kirato-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kirato-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language] || translations['EN'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = translations['EN'];
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return typeof current === 'string' ? current : path;
  }, [language]);

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