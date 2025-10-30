import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mql: MediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addListener: listener => listeners.add(listener),
      removeListener: listener => listeners.delete(listener),
      addEventListener: (_type, listener) => {
        if (typeof listener === 'function') {
          listeners.add(listener);
        }
      },
      removeEventListener: (_type, listener) => {
        if (typeof listener === 'function') {
          listeners.delete(listener);
        }
      },
      dispatchEvent: event => {
        listeners.forEach(listener => listener(event as MediaQueryListEvent));
        return true;
      }
    };
    return mql;
  };
}

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin = '0px';
    readonly thresholds: ReadonlyArray<number> = [0];
    private readonly listeners = new Set<IntersectionObserverCallback>();

    constructor(private callback: IntersectionObserverCallback) {}

    disconnect(): void {
      this.listeners.clear();
    }

    observe(target: Element): void {
      this.listeners.add(this.callback);
      const entry: IntersectionObserverEntry = {
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: target.getBoundingClientRect(),
        isIntersecting: true,
        isVisible: true,
        rootBounds: null,
        target,
        time: Date.now()
      };
      this.callback([entry], this);
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve(_target: Element): void {
      this.listeners.delete(this.callback);
    }

    addEventListener(): void {
      // no-op
    }

    removeEventListener(): void {
      // no-op
    }

    dispatchEvent(): boolean {
      return false;
    }
  }

  (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockIntersectionObserver;
}
