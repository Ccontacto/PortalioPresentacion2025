import { useEffect, useState } from 'react';

import { ACCENT_COLOR_TOKENS, cssVar } from '../utils/designTokens';

export default function PageProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(height ? (scrolled / height) * 100 : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
        background: cssVar(ACCENT_COLOR_TOKENS.electricTeal),
        zIndex: 60,
        transition: 'width 120ms linear'
      }}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    />
  );
}
