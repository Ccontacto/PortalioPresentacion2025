import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('toggles between light and dark themes', () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.push(listener);
      },
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

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });
});
