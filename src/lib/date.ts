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
