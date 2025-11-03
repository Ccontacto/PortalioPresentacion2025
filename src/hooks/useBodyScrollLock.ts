import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow: string | null = null;

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') {
      return;
    }

    const body = document.body;
    if (lockCount === 0) {
      previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && previousOverflow !== null) {
        body.style.overflow = previousOverflow;
        previousOverflow = null;
      }
    };
  }, [locked]);
}
