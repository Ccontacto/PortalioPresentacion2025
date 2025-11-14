import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { en } from '../data/en';
import { es } from '../data/es';
import { storage } from '../utils/storage';
import { isRecord, isValidLang, type Lang } from '../utils/typeGuards';

import type { PortfolioData } from '../types/portfolio';

type Data = PortfolioData;
type LanguageContextValue = {
  data: Data;
  currentLang: Lang;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

const dict: Record<Lang, Data> = { es, en };

// MEJORA 6: RTL languages support
const rtlLanguages: Lang[] = [];
const STORAGE_KEY = 'portfolio_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Lang>(() => storage.get(STORAGE_KEY, 'es', isValidLang));

  // MEJORA 6: RTL direction setup
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRTL = rtlLanguages.includes(currentLang);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }
    storage.set(STORAGE_KEY, currentLang);
  }, [currentLang]);

  const toggleLanguage = useCallback(() => {
    setCurrentLang(prev => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let result: unknown = dict[currentLang];
      for (const k of keys) {
        if (isRecord(result) && k in result) {
          result = result[k];
        } else {
          return key;
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
