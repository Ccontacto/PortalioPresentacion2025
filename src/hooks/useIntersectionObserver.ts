import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? undefined;
  const thresholdValue = options?.threshold;
  const thresholdKey = useMemo(() => {
    if (Array.isArray(thresholdValue)) return thresholdValue.join(',');
    if (typeof thresholdValue === 'number') return thresholdValue.toString();
    return '';
  }, [thresholdValue]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      {
        root,
        rootMargin,
        threshold: Array.isArray(thresholdValue) ? thresholdValue : thresholdValue ?? undefined
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin, thresholdKey, thresholdValue]);

  return [ref as RefObject<T>, isIntersecting];
}
