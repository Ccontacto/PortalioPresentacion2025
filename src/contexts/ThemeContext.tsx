import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { storage } from '../utils/storage';

export type BaseTheme = 'light' | 'dark' | 'oled' | 'high-contrast';
export type Theme = BaseTheme | 'konami';

type ThemeContextValue = {
  theme: Theme;
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  toggleTheme: () => void;
  isKonami: boolean;
  activateKonami: () => void;
  deactivateKonami: () => void;
  toggleKonami: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const BASE_THEME_ORDER: BaseTheme[] = ['light', 'dark', 'oled', 'high-contrast'];
const THEME_STORAGE_KEY = 'portfolio_theme';
const KONAMI_STORAGE_KEY = 'portfolio_theme_konami';

const isBaseTheme = (value: unknown): value is BaseTheme =>
  typeof value === 'string' && BASE_THEME_ORDER.includes(value as BaseTheme);

const getInitialBaseTheme = (): BaseTheme => {
  if (typeof window === 'undefined') return 'light';
  const stored = storage.get<BaseTheme>(THEME_STORAGE_KEY, 'light', isBaseTheme);
  if (stored) return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const getInitialKonami = (): boolean => {
  const validator = (value: unknown): value is boolean | '0' | '1' =>
    value === true || value === false || value === '0' || value === '1';
  const stored = storage.get<boolean | '0' | '1'>(KONAMI_STORAGE_KEY, false, validator);
  if (stored === '1') return true;
  if (stored === '0') return false;
  return Boolean(stored);
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(getInitialBaseTheme);
  const [isKonami, setIsKonami] = useState<boolean>(getInitialKonami);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const resolvedTheme: Theme = isKonami ? 'konami' : baseTheme;

    root.setAttribute('data-theme', resolvedTheme);

    const shouldUseDarkChrome = resolvedTheme === 'dark' || resolvedTheme === 'oled' || resolvedTheme === 'konami';
    root.classList.toggle('dark', shouldUseDarkChrome);
    root.classList.toggle('konami', resolvedTheme === 'konami');
  }, [baseTheme, isKonami]);

  useEffect(() => {
    storage.set(THEME_STORAGE_KEY, baseTheme);
  }, [baseTheme]);

  useEffect(() => {
    storage.set(KONAMI_STORAGE_KEY, isKonami);
  }, [isKonami]);

  const setBaseTheme = useCallback((next: BaseTheme) => {
    setIsKonami(false);
    setBaseThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsKonami(false);
    setBaseThemeState(current => {
      const currentIndex = BASE_THEME_ORDER.indexOf(current);
      const nextIndex = (currentIndex + 1) % BASE_THEME_ORDER.length;
      return BASE_THEME_ORDER[nextIndex];
    });
  }, []);

  const activateKonami = useCallback(() => setIsKonami(true), []);
  const deactivateKonami = useCallback(() => setIsKonami(false), []);
  const toggleKonami = useCallback(() => {
    setIsKonami(prev => !prev);
  }, []);

  const theme: Theme = isKonami ? 'konami' : baseTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        baseTheme,
        setBaseTheme,
        toggleTheme,
        isKonami,
        activateKonami,
        deactivateKonami,
        toggleKonami
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
