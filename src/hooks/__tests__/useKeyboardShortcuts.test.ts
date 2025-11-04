import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts Hook', () => {
  it('should call the callback when the specified key is pressed', () => {
    const callback = vi.fn();
    const shortcuts = [{ keys: ['a'], callback }];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    fireEvent.keyDown(document, { key: 'a' });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the callback for a combination of keys', () => {
    const callback = vi.fn();
    const shortcuts = [{ keys: ['b'], metaKey: true, callback }];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    fireEvent.keyDown(document, { key: 'b', metaKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback if the wrong key is pressed', () => {
    const callback = vi.fn();
    const shortcuts = [{ keys: ['c'], callback }];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    fireEvent.keyDown(document, { key: 'd' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call the callback if the meta key is required but not pressed', () => {
    const callback = vi.fn();
    const shortcuts = [{ keys: ['e'], metaKey: true, callback }];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    fireEvent.keyDown(document, { key: 'e', metaKey: false });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple shortcuts', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const shortcuts = [
      { keys: ['f'], callback: callback1 },
      { keys: ['g'], callback: callback2 },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    fireEvent.keyDown(document, { key: 'f' });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'g' });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
