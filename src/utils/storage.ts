const STORAGE_TEST_KEY = '__portfolio_storage_test__';

type Validator<T> = (value: unknown) => value is T;

function canUseStorage(): boolean {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_TEST_KEY, STORAGE_TEST_KEY);
    window.localStorage.removeItem(STORAGE_TEST_KEY);
    return true;
  } catch {
    return false;
  }
}

class SafeStorage {
  private available: boolean | null = null;

  private isAvailable() {
    if (this.available !== null) {
      return this.available;
    }
    this.available = canUseStorage();
    return this.available;
  }

  get<T>(key: string, defaultValue: T, validator?: Validator<T>): T {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }

    try {
      const parsed = JSON.parse(raw);
      if (validator) {
        return validator(parsed) ? parsed : defaultValue;
      }
      return parsed as T;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`SafeStorage could not write to "${key}"`, error);
      return false;
    }
  }

  remove(key: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore cleanup errors.
    }
  }
}

export const storage = new SafeStorage();
