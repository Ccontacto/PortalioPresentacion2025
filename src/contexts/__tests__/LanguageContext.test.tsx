import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LanguageProvider, useLanguage } from '../LanguageContext';

describe('LanguageProvider', () => {
  beforeEach(() => {
    window.localStorage?.clear();
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  afterEach(() => {
    window.localStorage?.clear();
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  it('toggles language, persists selection and updates document metadata', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: LanguageProvider });

    expect(result.current.currentLang).toBe('es');
    expect(document.documentElement.getAttribute('lang')).toBe('es');

    act(() => {
      result.current.toggleLanguage();
    });

    await waitFor(() => expect(result.current.currentLang).toBe('en'));
    expect(window.localStorage.getItem('portfolio_lang')).toBe('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('returns fallback string for unknown keys', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: LanguageProvider });
    expect(result.current.t('nonexistent.path', 'fallback-value')).toBe('fallback-value');
  });
});
