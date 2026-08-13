import { describe, expect, it } from 'vitest';
import { formatDurationShort, getMsUntilNextUtcDay, getUtcDateKey } from './date';

describe('getMsUntilNextUtcDay', () => {
  it('returns the exact remaining time to the next UTC midnight', () => {
    const now = new Date('2026-08-05T20:00:00.000Z');
    expect(getMsUntilNextUtcDay(now)).toBe(4 * 60 * 60 * 1000);
  });

  it('is a full day when called exactly at UTC midnight', () => {
    const now = new Date('2026-08-05T00:00:00.000Z');
    expect(getMsUntilNextUtcDay(now)).toBe(24 * 60 * 60 * 1000);
  });
});

describe('formatDurationShort', () => {
  it('formats hours and minutes', () => {
    expect(formatDurationShort(4 * 60 * 60 * 1000)).toBe('4h 0m');
    expect(formatDurationShort(4 * 60 * 60 * 1000 + 24 * 60 * 1000)).toBe('4h 24m');
  });

  it('formats minutes only when under an hour', () => {
    expect(formatDurationShort(25 * 60 * 1000)).toBe('25m');
    expect(formatDurationShort(0)).toBe('0m');
  });
});

describe('getUtcDateKey reflects UTC regardless of the local calendar', () => {
  it('stays on the earlier UTC date even when a positive-offset local calendar has already advanced', () => {
    // 2026-08-05T20:00Z is 2026-08-06 06:00 in Sydney (UTC+10, no DST in August) —
    // the local calendar has turned over to a new day, but the UTC day has not.
    // The daily puzzle is intentionally shared worldwide, so it must track UTC here.
    const instant = new Date('2026-08-05T20:00:00.000Z');
    expect(getUtcDateKey(instant)).toBe('2026-08-05');
  });
});
