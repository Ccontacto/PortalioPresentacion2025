import { useEffect } from 'react';

import { addSectionDuration, incrementSectionView } from '../utils/telemetry';

type Options = {
  threshold?: number;
};

export function useSectionTelemetry(sectionId: string, options: Options = {}) {
  const { threshold = 0.4 } = options;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    let enterTime: number | null = null;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            enterTime = performance.now();
            incrementSectionView(sectionId);
          } else if (enterTime !== null) {
            const duration = performance.now() - enterTime;
            addSectionDuration(sectionId, duration);
            enterTime = null;
          }
        });
      },
      { threshold }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (enterTime !== null) {
        const duration = performance.now() - enterTime;
        addSectionDuration(sectionId, duration);
      }
    };
  }, [sectionId, threshold]);
}
