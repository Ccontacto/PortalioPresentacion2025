import { en } from '@data/en';
import { es } from '@data/es';
import { getUiString } from '@i18n/ui';
import { storage } from '@utils/storage';
import { isRecord, isValidLang } from '@utils/typeGuards';
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

import type { UiKey, UiNamespace } from '@i18n/ui';

type PortfolioData = import('@portfolio-types').PortfolioData;
type Lang = import('@utils/typeGuards').Lang;
type Data = PortfolioData;
type TranslateFn = <N extends UiNamespace>(namespace: N, key: UiKey<N>) => string;
type LanguageContextValue = {
  data: Data;
  currentLang: Lang;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
  t: TranslateFn;
  overrides: OverridesRecord;
  updateOverrides: (lang: Lang, patch: Partial<PortfolioData>) => void;
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
const OVERRIDES_KEY = 'portfolio_overrides';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function deepMerge<T>(target: T, source?: Partial<T>): T {
  if (!source || Object.keys(source).length === 0) return target;
  if (Array.isArray(target) || Array.isArray(source)) {
    return (source as T) ?? target;
  }
  if (!isPlainObject(target)) {
    return (source as T) ?? target;
  }
  const result = { ...(target as Record<string, unknown>) } as T;
  for (const key of Object.keys(source)) {
    const overrideValue = source[key as keyof T];
    if (overrideValue === undefined) continue;
    const currentValue = target[key as keyof T];
    if (
      isPlainObject(currentValue) &&
      isPlainObject(overrideValue) &&
      !Array.isArray(currentValue) &&
      !Array.isArray(overrideValue)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        currentValue,
        overrideValue as Partial<typeof currentValue>
      );
    } else {
      (result as Record<string, unknown>)[key] = overrideValue;
    }
  }
  return result;
}

function mergePartial<T>(base: Partial<T>, override: Partial<T>): Partial<T> {
  if (!override || Object.keys(override).length === 0) return base;
  const result = { ...base } as Partial<T>;
  for (const key of Object.keys(override)) {
    const overrideValue = override[key as keyof T];
    if (overrideValue === undefined) continue;
    const baseValue = base[key as keyof T];
    if (
      isPlainObject(baseValue) &&
      isPlainObject(overrideValue) &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      (result as Record<string, unknown>)[key] = mergePartial(
        baseValue as Partial<T[keyof T]>,
        overrideValue as Partial<T[keyof T]>
      );
    } else {
      (result as Record<string, unknown>)[key] = overrideValue;
    }
  }
  return result;
}

type OverridesRecord = Record<Lang, Partial<PortfolioData>>;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Lang>(() => storage.get(STORAGE_KEY, 'es', isValidLang));
  const [overrides, setOverrides] = useState<OverridesRecord>(() => {
    const raw =
      storage.get<Record<string, Partial<PortfolioData>>>(OVERRIDES_KEY, {}, isRecord) ?? {};
    return {
      es: raw.es ?? {},
      en: raw.en ?? {}
    };
  });

  // MEJORA 6: RTL direction setup
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRTL = rtlLanguages.includes(currentLang);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }
    storage.set(STORAGE_KEY, currentLang);
  }, [currentLang]);

  const setLanguage = useCallback((lang: Lang) => {
    setCurrentLang(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setCurrentLang(prev => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const updateOverrides = useCallback((lang: Lang, patch: Partial<PortfolioData>) => {
    setOverrides(prev => {
      const existing = prev[lang] ?? {};
      const nextLangOverrides = mergePartial(existing, patch);
      const next = { ...prev, [lang]: nextLangOverrides };
      storage.set(OVERRIDES_KEY, next);
      return next;
    });
  }, []);

  const mergedData = useMemo(() => deepMerge(dict[currentLang], overrides[currentLang]), [currentLang, overrides]);

  const t = useCallback<TranslateFn>(
    (namespace, key) => {
      return getUiString(currentLang, namespace, key);
    },
    [currentLang]
  );

  return (
    <LanguageContext.Provider
      value={{
        data: mergedData,
        currentLang,
        setLanguage,
        toggleLanguage,
        t,
        overrides,
        updateOverrides
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
