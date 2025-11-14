import type { ErrorInfo } from 'react';

const TELEMETRY_ENDPOINT = import.meta.env.VITE_TELEMETRY_ENDPOINT;

type Payload = {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  env: string;
  timestamp: string;
};

function buildPayload(error: Error, info?: ErrorInfo): Payload {
  return {
    message: error.message,
    stack: error.stack ?? undefined,
    componentStack: info?.componentStack ?? undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    env: import.meta.env.MODE,
    timestamp: new Date().toISOString(),
  };
}

function dispatchTelemetry(body: string) {
  if (!TELEMETRY_ENDPOINT) return;

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
        keepalive: true,
      });
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Telemetry dispatch failed', err);
    }
  }
}

export function logAppError(error: Error, info?: ErrorInfo) {
  const payload = buildPayload(error, info);

  if (import.meta.env.DEV) {
    console.error('Captured error via telemetry helper:', payload);
  }

  try {
    dispatchTelemetry(JSON.stringify(payload));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Failed to report error telemetry', err);
    }
  }
}
