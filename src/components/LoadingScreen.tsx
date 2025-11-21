import { useEffect, useState } from 'react';

export default function LoadingScreen({ duration = 900 }: { duration?: number }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (done) return null;

  return (
    <div
      className="loading-overlay"
      role="status"
      aria-label="Cargando portfolio"
    >
      <div className="logo" aria-hidden="true">
        JC
      </div>
      <span className="sr-only">Cargando contenido...</span>
    </div>
  );
}
