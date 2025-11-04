import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when matchMedia is not available', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('responds to media query preference changes', () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const addEventListener = vi.fn((_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    });
    const removeEventListener = vi.fn();

    const matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(listener => listeners.push(listener)),
      removeListener: vi.fn(),
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      dispatchEvent: vi.fn()
    }));

    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    act(() => {
      listeners.forEach(listener =>
        listener({
          matches: false
        } as MediaQueryListEvent)
      );
    });

    expect(result.current).toBe(false);
  });
});
