import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getDailySeed } from './dailySeed';
import { generateDailyPuzzle } from './puzzleGenerator';
import { loadPuzzleResult, savePuzzleResult } from './puzzleStorage';
import { resolveTodayResult } from './devReset';
import { getUtcDateKey } from '../lib/date';

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

const YESTERDAY = '2026-08-04';
const TODAY = '2026-08-05';

describe('daily rollover', () => {
  it("does not let yesterday's completion block today's puzzle", () => {
    savePuzzleResult({
      dateKey: YESTERDAY,
      puzzleNumber: 216,
      outcome: 'X',
      moveCount: 12,
      boardStatus: Array(9).fill(null),
    });

    // Today's key was never written, so resolving today must come back empty
    // regardless of what happened on any other date.
    expect(resolveTodayResult(TODAY)).toBeNull();
  });

  it("preserves today's completion across a refresh (same date resolved twice)", () => {
    savePuzzleResult({
      dateKey: TODAY,
      puzzleNumber: 217,
      outcome: 'draw',
      moveCount: 30,
      boardStatus: Array(9).fill(null),
    });

    const firstLoad = resolveTodayResult(TODAY);
    const secondLoad = resolveTodayResult(TODAY); // simulates reloading later the same day

    expect(firstLoad?.outcome).toBe('draw');
    expect(secondLoad?.outcome).toBe('draw');
    expect(secondLoad?.moveCount).toBe(30);
  });

  it('produces a different seed — and a different starting position — for each date', () => {
    const seedYesterday = getDailySeed(YESTERDAY);
    const seedToday = getDailySeed(TODAY);
    expect(seedYesterday).not.toBe(seedToday);

    const puzzleYesterday = generateDailyPuzzle(seedYesterday);
    const puzzleToday = generateDailyPuzzle(seedToday);
    expect(puzzleYesterday.boards).not.toEqual(puzzleToday.boards);
  });

  it('loads the result matching the requested date, not any other stored date', () => {
    savePuzzleResult({
      dateKey: YESTERDAY,
      puzzleNumber: 216,
      outcome: 'O',
      moveCount: 20,
      boardStatus: Array(9).fill(null),
    });
    savePuzzleResult({
      dateKey: TODAY,
      puzzleNumber: 217,
      outcome: 'X',
      moveCount: 15,
      boardStatus: Array(9).fill(null),
    });

    expect(loadPuzzleResult(YESTERDAY)?.outcome).toBe('O');
    expect(loadPuzzleResult(TODAY)?.outcome).toBe('X');
    expect(resolveTodayResult(YESTERDAY)?.puzzleNumber).toBe(216);
    expect(resolveTodayResult(TODAY)?.puzzleNumber).toBe(217);
  });

  it('keys off the UTC day even when the caller is in a timezone whose local calendar has already advanced', () => {
    // 2026-08-05T20:00Z is already 2026-08-06 in Sydney (UTC+10, no DST in August),
    // but the UTC day — which is what the shared daily puzzle is keyed on — is still
    // 2026-08-05. A completion saved under that UTC day must still resolve correctly;
    // this is the puzzle intentionally staying synchronized worldwide, not a stale read.
    const instant = new Date('2026-08-05T20:00:00.000Z');
    const utcDateKey = getUtcDateKey(instant);
    expect(utcDateKey).toBe('2026-08-05');

    savePuzzleResult({
      dateKey: utcDateKey,
      puzzleNumber: 217,
      outcome: 'X',
      moveCount: 18,
      boardStatus: Array(9).fill(null),
    });

    expect(resolveTodayResult(utcDateKey)?.outcome).toBe('X');
  });
});
