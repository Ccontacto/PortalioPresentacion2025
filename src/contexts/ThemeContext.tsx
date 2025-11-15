import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { storage } from '../utils/storage';

const BASE_THEME_SEQUENCE = ['light', 'dark', 'oled', 'high-contrast'] as const;
export const BASE_THEME_ORDER: readonly BaseTheme[] = [...BASE_THEME_SEQUENCE];
export type BaseTheme = (typeof BASE_THEME_SEQUENCE)[number];
type Theme = BaseTheme | 'konami';
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

const isBaseTheme = (value: unknown): value is BaseTheme =>
  typeof value === 'string' && BASE_THEME_SEQUENCE.includes(value as BaseTheme);
const isKonamiValue = (value: unknown): value is boolean | '0' | '1' =>
  value === true || value === false || value === '0' || value === '1';

const detectSystemTheme = (): BaseTheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
  if (prefersHighContrast) {
    return 'high-contrast';
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const getInitialBaseTheme = (): BaseTheme => {
  const defaultTheme = detectSystemTheme();
  return storage.get(THEME_STORAGE_KEY, defaultTheme, isBaseTheme);
};

const getInitialKonami = (): boolean => {
  const stored = storage.get<boolean | '0' | '1'>(KONAMI_STORAGE_KEY, false, isKonamiValue);
  if (stored === '1') return true;
  if (stored === '0') return false;
  return stored === true;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(getInitialBaseTheme);
  const [isKonami, setIsKonami] = useState<boolean>(getInitialKonami);

  const theme = useMemo<Theme>(() => (isKonami ? 'konami' : baseTheme), [isKonami, baseTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    storage.set(THEME_STORAGE_KEY, baseTheme);
  }, [baseTheme]);

  useEffect(() => {
    storage.set(KONAMI_STORAGE_KEY, isKonami);
  }, [isKonami]);

  const toggleTheme = useCallback(() => {
    setIsKonami(false);
    setBaseThemeState(prev => {
      const currentIndex = BASE_THEME_SEQUENCE.indexOf(prev);
      const nextIndex = (currentIndex + 1) % BASE_THEME_SEQUENCE.length;
      return BASE_THEME_SEQUENCE[nextIndex];
    });
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
