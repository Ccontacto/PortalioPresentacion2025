import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type BaseTheme = 'light' | 'dark';
export type Theme = BaseTheme | 'konami';

type ThemeContextValue = {
  theme: Theme;
  baseTheme: BaseTheme;
  isKonami: boolean;
  toggleTheme: () => void;
  setBaseTheme: (theme: BaseTheme) => void;
  activateKonami: () => void;
  deactivateKonami: () => void;
  toggleKonami: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const THEME_STORAGE_KEY = 'portfolio_theme';
const KONAMI_STORAGE_KEY = 'portfolio_theme_konami';

const getStoredBaseTheme = (): BaseTheme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as BaseTheme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const getStoredKonami = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(KONAMI_STORAGE_KEY) === '1';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(getStoredBaseTheme);
  const [isKonami, setIsKonami] = useState<boolean>(getStoredKonami);

  const theme = useMemo<Theme>(() => (isKonami ? 'konami' : baseTheme), [isKonami, baseTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, baseTheme);
    }
  }, [baseTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KONAMI_STORAGE_KEY, isKonami ? '1' : '0');
    }
  }, [isKonami]);

  const toggleTheme = useCallback(() => {
    setIsKonami(false);
    setBaseThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setBaseTheme = useCallback((next: BaseTheme) => {
    setIsKonami(false);
    setBaseThemeState(next);
  }, []);

  const activateKonami = useCallback(() => {
    setIsKonami(true);
  }, []);

  const deactivateKonami = useCallback(() => {
    setIsKonami(false);
  }, []);

  const toggleKonami = useCallback(() => {
    setIsKonami(prev => !prev);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      baseTheme,
      isKonami,
      toggleTheme,
      setBaseTheme,
      activateKonami,
      deactivateKonami,
      toggleKonami
    };
  }, [theme, baseTheme, isKonami, toggleTheme, setBaseTheme, activateKonami, deactivateKonami, toggleKonami]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
