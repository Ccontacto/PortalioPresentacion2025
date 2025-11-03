import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);
  const root = options?.root ?? null;
  const serializedOptions = useMemo(() => {
    return JSON.stringify({
      rootMargin: options?.rootMargin ?? null,
      threshold: options?.threshold ?? null
    });
  }, [options?.rootMargin, options?.threshold]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const element = ref.current;
    if (!element) return;

    const parsed = JSON.parse(serializedOptions) as {
      rootMargin: string | null;
      threshold: number | number[] | null;
    };

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIntersecting(entry?.isIntersecting ?? false);
      },
      {
        root,
        rootMargin: parsed.rootMargin ?? undefined,
        threshold: parsed.threshold ?? undefined
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [root, serializedOptions]);

  return [ref as RefObject<T>, isIntersecting];
}
