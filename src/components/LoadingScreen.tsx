import { useEffect, useState } from 'react';

import { SparkStars } from './SparkStars';

export default function LoadingScreen({ duration, isSplash }: { duration?: number; isSplash?: boolean }) {
  const [done, setDone] = useState(!isSplash);
  const [variant, setVariant] = useState<'classic' | 'motion'>('classic');

  useEffect(() => {
    if (typeof duration !== 'number' || duration <= 0) {
      return;
    }
    const timer = setTimeout(() => setDone(true), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (done) return null;

  return (
    <div className="loading-overlay spark-loading" role="status" aria-label="Cargando portfolio con animación">
      <SparkStars variant={variant} message="Translating human to computer." />
      <div className="spark-loading__actions">
        <div className="spark-loading__toggle" role="group" aria-label="Cambiar animación de carga">
          <button
            type="button"
            className={`spark-loading__button ${variant === 'classic' ? 'is-active' : ''}`}
            onClick={() => setVariant('classic')}
          >
            CSS Spark
          </button>
          <button
            type="button"
            className={`spark-loading__button ${variant === 'motion' ? 'is-active' : ''}`}
            onClick={() => setVariant('motion')}
          >
            Motion Spark
          </button>
        </div>
        <button type="button" className="spark-loading__skip" onClick={() => setDone(true)}>
          Skip / Entrar al portfolio
        </button>
      </div>
      <span className="sr-only">Animación de carga activa. Usa el botón Skip para continuar.</span>
    </div>
  );
}
