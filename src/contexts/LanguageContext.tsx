import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { en } from '../data/en';
import { es } from '../data/es';

import type { PortfolioData } from '../types/portfolio';

type Data = PortfolioData;
type Lang = PortfolioData['lang'];

type LanguageContextValue = {
  data: Data;
  currentLang: Lang;
  toggleLanguage: () => void;
  t: (key: string, defaultValue?: string) => string;
};

const fallbackContext: LanguageContextValue = {
  data: es,
  currentLang: 'es',
  toggleLanguage: () => {
    if (import.meta.env?.DEV) {
      console.warn('[LanguageContext] LanguageProvider ausente. Usando fallback ES.');
    }
  },
  t: (key: string, defaultValue?: string) => defaultValue ?? key
};

const LanguageContext = createContext<LanguageContextValue>(fallbackContext);

let fallbackWarningEmitted = false;
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (ctx === fallbackContext && import.meta.env?.DEV && !fallbackWarningEmitted) {
    fallbackWarningEmitted = true;
    console.warn('[LanguageContext] Se está utilizando el contexto por defecto sin LanguageProvider.');
  }
  return ctx;
};

const dict: Record<Lang, Data> = { es, en };

// MEJORA 6: RTL languages support
const rtlLanguages: Lang[] = [];
const STORAGE_KEY = 'portfolio_lang';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'es';
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored === 'en' ? 'en' : 'es';
  });

  // MEJORA 6: RTL direction setup
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRTL = rtlLanguages.includes(currentLang);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, currentLang);
    }
  }, [currentLang]);

  const toggleLanguage = useCallback(() => {
    setCurrentLang(prev => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (key: string, defaultValue?: string) => {
      const keys = key.split('.');
      let result: unknown = dict[currentLang];
      for (const k of keys) {
        if (isRecord(result) && k in result) {
          result = result[k];
        } else {
          return defaultValue ?? key;
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [currentLang]
  );

  return (
    <LanguageContext.Provider value={{ data: dict[currentLang], currentLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
