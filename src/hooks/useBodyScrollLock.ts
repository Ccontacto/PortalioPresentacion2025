import { useEffect } from 'react';

class BodyScrollLockManager {
  private lockCount = 0;
  private previousOverflow: string | null = null;

  acquire() {
    if (typeof document === 'undefined') return;

    if (this.lockCount === 0) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    this.lockCount += 1;
  }

  release() {
    if (typeof document === 'undefined') return;

    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      document.body.style.overflow = this.previousOverflow ?? '';
      this.previousOverflow = null;
    }
  }
}

const manager = new BodyScrollLockManager();

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    manager.acquire();
    return () => {
      manager.release();
    };
  }, [locked]);
}
