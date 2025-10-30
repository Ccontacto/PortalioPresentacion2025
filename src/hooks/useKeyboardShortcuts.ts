import { useEffect } from 'react';

type Shortcut = {
  keys: string[];
  callback: (e: KeyboardEvent) => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

export function useKeyboardShortcuts(shortcuts: Shortcut[] = []) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      shortcuts.forEach(s => {
        const keyOk = s.keys.some(k => e.key.toLowerCase() === k.toLowerCase());
        const modsOk =
          (s.ctrlKey === undefined || s.ctrlKey === e.ctrlKey) &&
          (s.altKey === undefined || s.altKey === e.altKey) &&
          (s.shiftKey === undefined || s.shiftKey === e.shiftKey) &&
          (s.metaKey === undefined || s.metaKey === e.metaKey);

        if (keyOk && modsOk) {
          e.preventDefault();
          s.callback(e);
        }
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
