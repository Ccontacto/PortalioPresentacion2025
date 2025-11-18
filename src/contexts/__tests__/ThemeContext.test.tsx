import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage } from '../../utils/storage';
import { BASE_THEME_ORDER, ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeProvider', () => {
  let getSpy: ReturnType<typeof vi.spyOn>;
  let setSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage?.clear();
    getSpy = vi.spyOn(storage, 'get').mockImplementation((_, defaultValue) => defaultValue);
    setSpy = vi.spyOn(storage, 'set').mockImplementation(() => true);
  });

  afterEach(() => {
    window.localStorage?.clear();
    getSpy?.mockRestore();
    setSpy?.mockRestore();
    vi.unstubAllGlobals();
  });

  it('manages base and Konami themes', () => {
    const matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      dispatchEvent: vi.fn()
    }));
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });

    const startIndex = BASE_THEME_ORDER.indexOf(result.current.baseTheme);
    expect(startIndex).toBeGreaterThan(-1);

    act(() => {
      result.current.toggleTheme();
    });

    const nextIndex = (startIndex + 1) % BASE_THEME_ORDER.length;
    expect(result.current.baseTheme).toBe(BASE_THEME_ORDER[nextIndex]);
    expect(result.current.theme).toBe(BASE_THEME_ORDER[nextIndex]);
    expect(result.current.isKonami).toBe(false);

    act(() => {
      result.current.activateKonami();
    });

    expect(result.current.theme).toBe('konami');
    expect(result.current.baseTheme).toBe(BASE_THEME_ORDER[nextIndex]);
    expect(result.current.isKonami).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    const afterKonamiIndex = (nextIndex + 1) % BASE_THEME_ORDER.length;
    expect(result.current.theme).toBe(BASE_THEME_ORDER[afterKonamiIndex]);
    expect(result.current.baseTheme).toBe(BASE_THEME_ORDER[afterKonamiIndex]);
    expect(result.current.isKonami).toBe(false);

    act(() => {
      result.current.toggleKonami();
    });

    expect(result.current.theme).toBe('konami');
    expect(result.current.isKonami).toBe(true);

    act(() => {
      result.current.deactivateKonami();
    });

    expect(result.current.theme).toBe(BASE_THEME_ORDER[afterKonamiIndex]);
    expect(result.current.isKonami).toBe(false);
  });
});
