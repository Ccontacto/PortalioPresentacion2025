import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('storage utils', () => {
  beforeEach(() => {
    vi.resetModules();
    if (typeof localStorage?.clear === 'function') {
      localStorage.clear();
    }
  });

  it('falls back to default when nothing is stored', async () => {
    const { storage } = await import('../storage');
    expect(storage.get('missing', 'default')).toBe('default');
  });

  it('returns parsed values and obeys validators', async () => {
    const { storage } = await import('../storage');
    localStorage.setItem('value', JSON.stringify({ foo: 'bar' }));
    expect(storage.get('value', null)).toEqual({ foo: 'bar' });

    localStorage.setItem('number', '12');
    expect(storage.get('number', 0, (value): value is number => typeof value === 'number')).toBe(12);

    localStorage.setItem('number', '"invalid"');
    expect(storage.get('number', 0, (value): value is number => typeof value === 'number')).toBe(0);
  });

  it('returns default when JSON parse fails', async () => {
    const { storage } = await import('../storage');
    localStorage.setItem('broken', 'not-json');
    expect(storage.get('broken', 'fallback')).toBe('fallback');
  });

  it('handles localStorage write errors gracefully', async () => {
    const originalLocalStorage = window.localStorage;
    const localStorageMock = {
      getItem: vi.fn(() => null),
      removeItem: vi.fn(),
      setItem: vi.fn(() => null)
    };
    vi.stubGlobal('localStorage', localStorageMock);

    const { storage } = await import('../storage');
    localStorageMock.setItem = vi.fn(() => {
      throw new Error('nope');
    });

    expect(storage.set('foo', 'bar')).toBe(false);
    vi.stubGlobal('localStorage', originalLocalStorage);
  });

  it('resets keys when schema version is outdated', async () => {
    const { storage, ensureStorageVersion } = await import('../storage');
    const setSpy = vi.spyOn(storage, 'set');
    const removeSpy = vi.spyOn(storage, 'remove');

    storage.set('__portfolio_storage_schema_version__', 1);
    ensureStorageVersion(3, ['outdated']);

    expect(removeSpy).toHaveBeenCalledWith('outdated');
    expect(setSpy).toHaveBeenCalledWith('__portfolio_storage_schema_version__', 3);
  });
});
