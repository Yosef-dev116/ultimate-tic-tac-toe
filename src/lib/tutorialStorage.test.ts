import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasSeenTutorial, markTutorialSeen } from './tutorialStorage';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('tutorialStorage', () => {
  it('has not been seen by default', () => {
    expect(hasSeenTutorial()).toBe(false);
  });

  it('is seen after being marked', () => {
    markTutorialSeen();
    expect(hasSeenTutorial()).toBe(true);
  });

  it('stays seen across repeated checks', () => {
    markTutorialSeen();
    expect(hasSeenTutorial()).toBe(true);
    expect(hasSeenTutorial()).toBe(true);
  });
});
