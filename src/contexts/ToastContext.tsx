import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const MAX_TOASTS = 5;
const TOAST_TIMEOUT = 3000;

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
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => {
      const newToasts = [...prev, { id, message, type }];
      if (newToasts.length > MAX_TOASTS) {
        const oldestToast = newToasts.shift();
        if (oldestToast) {
          const timeoutId = timersRef.current.get(oldestToast.id);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timersRef.current.delete(oldestToast.id);
          }
        }
      }
      return newToasts;
    });
    const timeoutId = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timersRef.current.delete(id);
    }, TOAST_TIMEOUT);
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
