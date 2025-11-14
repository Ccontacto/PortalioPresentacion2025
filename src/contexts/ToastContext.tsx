import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const MAX_TOASTS = 5;
const TOAST_DURATION_MS = 3500;
let nextToastId = 0;

type ToastType = 'info' | 'success' | 'error' | 'warning';
type Toast = { id: number; message: string; type: ToastType };

type ToastContextValue = {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    nextToastId += 1;
    const id = nextToastId;
    setToasts(prev => {
      const next = [...prev, { id, message, type }];
      if (next.length > MAX_TOASTS) {
        const [removed, ...rest] = next;
        const removedTimer = timersRef.current.get(removed.id);
        if (removedTimer) {
          clearTimeout(removedTimer);
          timersRef.current.delete(removed.id);
        }
        return rest;
      }
      return next;
    });
    const timeoutId = (typeof window !== 'undefined' ? window : globalThis).setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timersRef.current.delete(id);
    }, TOAST_DURATION_MS);
    timersRef.current.set(id, timeoutId);
  }, []);

  const removeToast = useCallback((id: number) => {
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(timeoutId => clearTimeout(timeoutId));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
