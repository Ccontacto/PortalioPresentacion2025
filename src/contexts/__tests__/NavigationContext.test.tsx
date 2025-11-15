import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationProvider, useNavigation } from '../NavigationContext';

let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
}

describe('NavigationContext', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    intersectionCallback = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets active page and scrolls when a section exists', () => {
    const scrollMock = vi.fn();
    const section = document.createElement('div');
    section.id = 'experience';
    section.scrollIntoView = scrollMock;
    document.body.appendChild(section);

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider
    });

    act(() => {
      result.current.navigateTo('experience');
    });

    expect(result.current.activePage).toBe('experience');
    expect(scrollMock).toHaveBeenCalled();

    section.remove();
  });

  it('updates active page even if the DOM element is missing', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider
    });

    act(() => {
      result.current.navigateTo('missing');
    });

    expect(result.current.activePage).toBe('missing');
  });

  it('responds to intersection observer entries', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider
    });

    act(() => {
      intersectionCallback?.([
        {
          isIntersecting: true,
          target: { id: 'focus' } as Element
        } as IntersectionObserverEntry
      ]);
    });

    expect(result.current.activePage).toBe('focus');
  });
});
