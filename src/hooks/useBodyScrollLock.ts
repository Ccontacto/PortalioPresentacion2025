import { useEffect, useRef } from 'react';

class ScrollLockManager {
  private locks = new Set<symbol>();
  private originalOverflow: string | null = null;

  lock(): symbol {
    const lockId = Symbol('body-scroll-lock');
    if (this.locks.size === 0 && typeof document !== 'undefined') {
      this.originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    this.locks.add(lockId);
    return lockId;
  }

  unlock(id: symbol) {
    if (!this.locks.has(id)) return;

    this.locks.delete(id);
    if (this.locks.size === 0 && typeof document !== 'undefined') {
      document.body.style.overflow = this.originalOverflow ?? '';
      this.originalOverflow = null;
    }
  }
}

const scrollLockManager = new ScrollLockManager();

export function useBodyScrollLock(locked: boolean) {
  const lockIdRef = useRef<symbol | null>(null);

  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    lockIdRef.current = scrollLockManager.lock();
    return () => {
      if (lockIdRef.current) {
        scrollLockManager.unlock(lockIdRef.current);
        lockIdRef.current = null;
      }
    };
  }, [locked]);
}
