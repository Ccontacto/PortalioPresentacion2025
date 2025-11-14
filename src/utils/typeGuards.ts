export type Lang = 'es' | 'en';

export function isValidLang(value: unknown): value is Lang {
  return typeof value === 'string' && (value === 'es' || value === 'en');
}

export function isRecord<T = unknown>(value: unknown): value is Record<string, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
