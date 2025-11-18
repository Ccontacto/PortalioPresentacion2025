import { useTelemetry } from '@contexts/TelemetryContext';
import { useEffect } from 'react';


import { addSectionDuration, incrementSectionView } from './metrics';

export function useSectionTelemetry(sectionId: string, options: { threshold?: number } = {}) {
  const { threshold = 0.4 } = options;
  const { preference } = useTelemetry();

  useEffect(() => {
    if (preference !== 'granted') return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (typeof IntersectionObserver === 'undefined') return;
    const target = document.getElementById(sectionId);
    if (!target) return;

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
  }, [preference, sectionId, threshold]);
}
