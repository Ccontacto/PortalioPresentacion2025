import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type DevContextValue = {
  devIds: boolean;
  toggleDevIds: () => void;
};

const DevContext = createContext<DevContextValue | null>(null);

export function useDev() {
  const ctx = useContext(DevContext);
  if (!ctx) throw new Error('useDev must be used within DevProvider');
  return ctx;
}

const STORAGE_KEY = 'portfolio_dev_ids';

export function DevProvider({ children }: { children: React.ReactNode }) {
  const [devIds, setDevIds] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (devIds) {
      document.documentElement.setAttribute('data-dev-ids', 'on');
    } else {
      document.documentElement.removeAttribute('data-dev-ids');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, devIds ? '1' : '0');
    }
  }, [devIds]);

  const toggleDevIds = useCallback(() => setDevIds(v => !v), []);

  return <DevContext.Provider value={{ devIds, toggleDevIds }}>{children}</DevContext.Provider>;
}

