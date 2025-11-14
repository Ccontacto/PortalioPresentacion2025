import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { storage } from '../utils/storage';

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

const isBooleanOrFlag = (value: unknown): value is boolean | '0' | '1' =>
  value === true || value === false || value === '0' || value === '1';

const getInitialDevIds = () => {
  const saved = storage.get<boolean | '0' | '1'>(STORAGE_KEY, false, isBooleanOrFlag);
  return saved === true || saved === '1';
};

export function DevProvider({ children }: { children: React.ReactNode }) {
  const [devIds, setDevIds] = useState<boolean>(getInitialDevIds);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (devIds) {
      document.documentElement.setAttribute('data-dev-ids', 'on');
    } else {
      document.documentElement.removeAttribute('data-dev-ids');
    }
    storage.set(STORAGE_KEY, devIds);
  }, [devIds]);

  const toggleDevIds = useCallback(() => setDevIds(v => !v), []);

  return <DevContext.Provider value={{ devIds, toggleDevIds }}>{children}</DevContext.Provider>;
}
