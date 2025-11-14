export const VALID_LANGS = ['es', 'en'] as const;
export type Lang = (typeof VALID_LANGS)[number];

export function isValidLang(value: unknown): value is Lang {
  return typeof value === 'string' && VALID_LANGS.includes(value as Lang);
}

export function isRecord<T = unknown>(value: unknown): value is Record<string, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
