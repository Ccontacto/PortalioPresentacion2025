import { useCallback, useRef } from 'react';

/**
 * Cola una acción para ejecutarse cuando termine la animación de salida
 * (útil con AnimatePresence.onExitComplete). Incluye guarda anti-reentrada.
 */
export function useDeferredExitAction() {
  const runningRef = useRef(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const queue = useCallback((fn: () => void) => {
    if (runningRef.current) return false;
    runningRef.current = true;
    pendingActionRef.current = () => {
      try {
        fn();
      } finally {
        runningRef.current = false;
        pendingActionRef.current = null;
      }
    };
    return true;
  }, []);

  const onExitComplete = useCallback(() => {
    if (pendingActionRef.current) {
      pendingActionRef.current();
    }
  }, []);

  const reset = useCallback(() => {
    runningRef.current = false;
    pendingActionRef.current = null;
  }, []);

  return {
    /** Intenta encolar una acción; devuelve false si ya hay una en curso */
    queue,
    /** Llama en AnimatePresence.onExitComplete */
    onExitComplete,
    /** Limpia estado interno */
    reset,
    /** Sólo lectura para debug */
    isRunning: () => runningRef.current
  } as const;
}

