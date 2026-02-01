
export type Language = 'UZ' | 'RU' | 'EN';
export type Theme = 'light' | 'dark';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  homeTitle: string;
  homeSubtitle: string;
  modules: {
    [key: string]: {
      title: string;
      subtitle: string;
    }
  };
  common: {
    back: string;
    placeholder: string;
  };
}

export interface AppState {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

export interface ModuleConfig {
  id: string;
  iconName: string;
  color: string;
  path: string;
  translationKey: string;
}
