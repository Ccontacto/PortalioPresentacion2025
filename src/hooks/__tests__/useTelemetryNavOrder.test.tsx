import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { useTelemetryNavOrder } from '../../telemetry/useTelemetryNavOrder';

const subscribers: Array<() => void> = [];
const reorderMock = vi.fn();
const subscribeMock = vi.fn((callback: () => void) => {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index >= 0) {
      subscribers.splice(index, 1);
    }
  };
});

vi.mock('../../telemetry/metrics', () => ({
  reorderItemsByTelemetry: (items: Array<{ id: string }>) => reorderMock(items),
  subscribeToTelemetry: (callback: () => void) => subscribeMock(callback)
}));

describe('useTelemetryNavOrder', () => {
  const navItems = [
    { id: 'home' },
    { id: 'projects' },
    { id: 'contact' }
  ];

  beforeEach(() => {
    subscribers.length = 0;
    reorderMock.mockReset();
    subscribeMock.mockClear();
  });

  it('uses telemetry ordering immediately', () => {
    reorderMock.mockImplementation(items => [...items].reverse());
    const { result } = renderHook(() => useTelemetryNavOrder(navItems));
    expect(result.current.map(item => item.id)).toEqual(['contact', 'projects', 'home']);
  });

  it('updates order when telemetry emits', () => {
    reorderMock.mockImplementation(items => items);
    const { result } = renderHook(() => useTelemetryNavOrder(navItems));
    expect(result.current.map(item => item.id)).toEqual(['home', 'projects', 'contact']);

    reorderMock.mockImplementation(items => [...items].reverse());
    act(() => {
      subscribers.forEach(callback => callback());
    });

    expect(result.current.map(item => item.id)).toEqual(['contact', 'projects', 'home']);
  });

  it('cleans subscription on unmount', () => {
    reorderMock.mockImplementation(items => items);
    const { unmount } = renderHook(() => useTelemetryNavOrder(navItems));
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribers).toHaveLength(1);

    unmount();
    expect(subscribers).toHaveLength(0);
  });
});
