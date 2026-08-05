import { describe, expect, it } from 'vitest';
import { getDailySeed } from './dailySeed';
import { generateDailyPuzzle } from './puzzleGenerator';
import { getPuzzleNumber, getUtcDateKey } from '../lib/date';

describe('getDailySeed', () => {
  it('is deterministic for the same date key', () => {
    expect(getDailySeed('2026-08-04')).toBe(getDailySeed('2026-08-04'));
  });

  it('differs across dates', () => {
    expect(getDailySeed('2026-08-04')).not.toBe(getDailySeed('2026-08-05'));
  });
});

describe('generateDailyPuzzle', () => {
  it('produces an identical starting position for the same seed', () => {
    const seed = getDailySeed('2026-08-04');
    const a = generateDailyPuzzle(seed);
    const b = generateDailyPuzzle(seed);
    expect(a.boards).toEqual(b.boards);
    expect(a.activeBoard).toBe(b.activeBoard);
  });

  it('produces different starting positions across most seeds', () => {
    const a = generateDailyPuzzle(getDailySeed('2026-08-04'));
    const b = generateDailyPuzzle(getDailySeed('2026-12-25'));
    expect(a.boards).not.toEqual(b.boards);
  });

  it('always hands control back to the human (X) after the opening', () => {
    for (const dateKey of ['2026-01-01', '2026-08-04', '2027-03-17']) {
      const state = generateDailyPuzzle(getDailySeed(dateKey));
      expect(state.currentPlayer).toBe('X');
      expect(state.winner).toBeNull();
    }
  });
});

describe('getUtcDateKey / getPuzzleNumber', () => {
  it('formats a UTC date as YYYY-MM-DD regardless of local time zone', () => {
    const date = new Date(Date.UTC(2026, 7, 4, 23, 59));
    expect(getUtcDateKey(date)).toBe('2026-08-04');
  });

  it('increments the puzzle number by one per day', () => {
    expect(getPuzzleNumber('2026-01-02')).toBe(getPuzzleNumber('2026-01-01') + 1);
  });
});
