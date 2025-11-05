import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import { ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeProvider', () => {
  afterEach(() => {
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

    expect(result.current.theme).toBe('light');
    expect(result.current.baseTheme).toBe('light');
    expect(result.current.isKonami).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.baseTheme).toBe('dark');
    expect(result.current.isKonami).toBe(false);

    act(() => {
      result.current.activateKonami();
    });

    expect(result.current.theme).toBe('konami');
    expect(result.current.baseTheme).toBe('dark');
    expect(result.current.isKonami).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.baseTheme).toBe('light');
    expect(result.current.isKonami).toBe(false);

    act(() => {
      result.current.toggleKonami();
    });

    expect(result.current.theme).toBe('konami');
    expect(result.current.isKonami).toBe(true);

    act(() => {
      result.current.deactivateKonami();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isKonami).toBe(false);
  });
});
