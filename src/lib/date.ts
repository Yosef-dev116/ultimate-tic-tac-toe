/** The first day the daily puzzle was live — puzzle numbers count up from here. */
const LAUNCH_EPOCH_UTC = Date.UTC(2026, 0, 1);

/** UTC-safe "today" key so every player worldwide gets the same puzzle on the same day. */
export function getUtcDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function dateKeyToUtcMs(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getPuzzleNumber(dateKey: string): number {
  const diffDays = Math.round((dateKeyToUtcMs(dateKey) - LAUNCH_EPOCH_UTC) / 86_400_000);
  return diffDays + 1;
}

/**
 * Milliseconds until the next UTC day begins, when a new daily puzzle unlocks.
 * The puzzle is intentionally the same for every player worldwide, so it always
 * resets on the UTC clock rather than each player's local midnight.
 */
export function getMsUntilNextUtcDay(now: Date = new Date()): number {
  const nextMidnightUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return nextMidnightUtc - now.getTime();
}

/** Formats a duration as a short "3h 24m" / "24m" string for display. */
export function formatDurationShort(ms: number): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
