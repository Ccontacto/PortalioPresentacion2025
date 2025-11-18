import { resetTelemetryMetrics } from '@telemetry/metrics';
import { logger } from '@utils/logger';
import { storage } from '@utils/storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'portfolio_telemetry_pref';

export type TelemetryPreference = 'granted' | 'denied' | 'unknown';

const isPreference = (value: unknown): value is TelemetryPreference =>
  value === 'granted' || value === 'denied' || value === 'unknown';

type TelemetryContextValue = {
  preference: TelemetryPreference;
  setPreference: (value: TelemetryPreference) => void;
  trackEvent: (event: string, props?: Record<string, unknown>) => void;
  resetMetrics: () => void;
};

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<TelemetryPreference>('unknown');

  useEffect(() => {
    const stored = storage.get<TelemetryPreference>(STORAGE_KEY, 'unknown', isPreference);
    setPreferenceState(stored ?? 'unknown');
  }, []);

  const setPreference = useCallback((value: TelemetryPreference) => {
    setPreferenceState(value);
    storage.set(STORAGE_KEY, value);
    if (value === 'denied') {
      resetTelemetryMetrics();
    }
  }, []);

  const trackEvent = useCallback(
    (event: string, props?: Record<string, unknown>) => {
      if (preference !== 'granted') return;
      try {
        logger.log('[telemetry]', event, props ?? {});
      } catch (error) {
        logger.warn('Telemetry trackEvent failed', error);
      }
    },
    [preference]
  );

  const resetMetrics = useCallback(() => {
    resetTelemetryMetrics();
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference, trackEvent, resetMetrics }),
    [preference, setPreference, trackEvent, resetMetrics]
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) {
    throw new Error('useTelemetry must be used within TelemetryProvider');
  }
  return ctx;
}
