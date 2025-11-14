import { useEffect } from 'react';

class BodyScrollLockManager {
  private static lockCount = 0;
  private static previousOverflow: string | null = null;

  static acquire() {
    if (typeof document === 'undefined') return;

    if (this.lockCount === 0) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    this.lockCount += 1;
  }

  static release() {
    if (typeof document === 'undefined') return;

    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      document.body.style.overflow = this.previousOverflow ?? '';
      this.previousOverflow = null;
    }
  }
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    BodyScrollLockManager.acquire();
    return () => {
      BodyScrollLockManager.release();
    };
  }, [locked]);
}
