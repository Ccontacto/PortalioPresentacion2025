import { useEffect } from 'react';

type Shortcut = {
  keys: string[];
  callback: (e: KeyboardEvent) => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

const IGNORED_TAGS = ['input', 'textarea', 'select'];

const shouldIgnoreShortcut = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (IGNORED_TAGS.includes(tag)) return true;
  if (target.isContentEditable) return true;
  if (target.closest('[contenteditable="true"]')) return true;
  return false;
};

export function useKeyboardShortcuts(shortcuts: Shortcut[] = []) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (shouldIgnoreShortcut(e.target)) {
        return;
      }

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
