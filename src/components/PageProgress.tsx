import { useEffect, useRef, useState } from 'react';

export default function PageProgress() {
  const [width, setWidth] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const recalc = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const nextWidth = height ? (scrolled / height) * 100 : 0;
      setWidth(prev => (prev === nextWidth ? prev : nextWidth));
    };

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        recalc();
      });
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 4,
        width: `${width}%`,
        background: '#A0E7E5',
        zIndex: 60,
        pointerEvents: 'none',
        transition: 'width 120ms linear'
      }}
      data-dev-id="8601"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    />
  );
}
