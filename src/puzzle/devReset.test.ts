import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEV_RESET_STORAGE_KEY, requestDevReset, resolveTodayResult } from './devReset';
import { savePuzzleResult } from './puzzleStorage';

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

describe('resolveTodayResult', () => {
  it('returns the stored result untouched when no reset is requested', () => {
    savePuzzleResult({
      dateKey: '2026-08-04',
      puzzleNumber: 1,
      outcome: 'X',
      moveCount: 10,
      boardStatus: Array(9).fill(null),
    });

    expect(resolveTodayResult('2026-08-04')?.outcome).toBe('X');
  });

  it('clears the completion state and consumes the flag when a reset is requested', () => {
    savePuzzleResult({
      dateKey: '2026-08-04',
      puzzleNumber: 1,
      outcome: 'X',
      moveCount: 10,
      boardStatus: Array(9).fill(null),
    });
    requestDevReset();
    expect(localStorage.getItem(DEV_RESET_STORAGE_KEY)).toBe('true');

    const result = resolveTodayResult('2026-08-04');
    expect(result).toBeNull();
    expect(localStorage.getItem(DEV_RESET_STORAGE_KEY)).toBeNull();

    // One-shot: a second call behaves like a normal, never-played day.
    expect(resolveTodayResult('2026-08-04')).toBeNull();
  });

  it('never fires without the documented flag being set', () => {
    savePuzzleResult({
      dateKey: '2026-08-04',
      puzzleNumber: 1,
      outcome: 'draw',
      moveCount: 30,
      boardStatus: Array(9).fill(null),
    });

    for (let i = 0; i < 5; i++) {
      expect(resolveTodayResult('2026-08-04')?.outcome).toBe('draw');
    }
  });

  it('only clears the targeted day, leaving other days untouched', () => {
    savePuzzleResult({
      dateKey: '2026-08-03',
      puzzleNumber: 1,
      outcome: 'O',
      moveCount: 5,
      boardStatus: Array(9).fill(null),
    });
    savePuzzleResult({
      dateKey: '2026-08-04',
      puzzleNumber: 2,
      outcome: 'X',
      moveCount: 8,
      boardStatus: Array(9).fill(null),
    });

    requestDevReset();
    resolveTodayResult('2026-08-04');

    expect(resolveTodayResult('2026-08-03')?.outcome).toBe('O');
  });
});
