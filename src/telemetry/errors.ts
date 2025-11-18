import type { ErrorInfo } from 'react';

const TELEMETRY_ENDPOINT = import.meta.env.VITE_TELEMETRY_ENDPOINT ?? '/api/errors';

export type ErrorPayload = {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  env: string;
  timestamp: string;
};

const buildErrorPayload = (error: Error, info?: ErrorInfo): ErrorPayload => ({
  message: error.message,
  stack: error.stack ?? undefined,
  componentStack: info?.componentStack ?? undefined,
  url: typeof window !== 'undefined' ? window.location.href : undefined,
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  env: import.meta.env.MODE,
  timestamp: new Date().toISOString()
});

export function logAppError(error: Error, info?: ErrorInfo) {
  const payload = buildErrorPayload(error, info);

  if (import.meta.env.DEV) {
    console.error('Captured error payload', payload);
  }

  if (!TELEMETRY_ENDPOINT) {
    return;
  }

  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(TELEMETRY_ENDPOINT, body);
      return;
    }
    if (typeof fetch !== 'undefined') {
      void fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      });
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Telemetry dispatch failed', err);
    }
  }
}
