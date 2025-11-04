import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
] as const;

const toKey = (value: string) => value.toLowerCase();

export function useKonamiCode(callback: () => void) {
  const positionRef = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = toKey(event.key);
      const expected = toKey(KONAMI_SEQUENCE[positionRef.current]);

      if (key === expected) {
        positionRef.current += 1;
        if (positionRef.current === KONAMI_SEQUENCE.length) {
          callbackRef.current();
          positionRef.current = 0;
        }
        return;
      }

      positionRef.current = key === toKey(KONAMI_SEQUENCE[0]) ? 1 : 0;
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
