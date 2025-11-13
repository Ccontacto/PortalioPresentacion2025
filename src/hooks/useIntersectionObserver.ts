import { useEffect, useRef, useState } from 'react';

import type { RefObject } from 'react';

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIntersecting(entry?.isIntersecting ?? false);
      },
      options
    );

    observer.observe(element);

    // Fallback para Safari iOS: comprobar visibilidad sincrónicamente
    const checkNow = () => {
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const inView = rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0;
      if (inView) setIntersecting(true);
    };
    // Chequeo inmediato y en el siguiente frame
    checkNow();
    window.requestAnimationFrame(checkNow);
    // Chequeo adicional tras carga (iOS tarda en pintar)
    window.addEventListener('load', checkNow, { once: true });
    return () => observer.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return [ref as RefObject<T>, isIntersecting];
}
