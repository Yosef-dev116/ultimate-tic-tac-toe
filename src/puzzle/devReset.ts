import { clearPuzzleResult, loadPuzzleResult, type PuzzleResult } from './puzzleStorage';

/**
 * Documented rehearsal/demo reset command.
 * From the browser devtools console, on any build:
 *   localStorage.setItem('uttt:dev-reset', 'true')
 * then reload the page. Clears today's completion state and restarts the
 * same daily puzzle (the seed is date-based, so it's identical). One-shot —
 * the flag consumes itself, so normal play afterward is unaffected.
 */
export const DEV_RESET_STORAGE_KEY = 'uttt:dev-reset';

function isDevResetFlagSet(): boolean {
  try {
    return localStorage.getItem(DEV_RESET_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function clearDevResetFlag(): void {
  try {
    localStorage.removeItem(DEV_RESET_STORAGE_KEY);
  } catch {
    // localStorage unavailable — nothing to clear.
  }
}

/** Arms the documented reset flag; the caller is responsible for reloading afterward. */
export function requestDevReset(): void {
  try {
    localStorage.setItem(DEV_RESET_STORAGE_KEY, 'true');
  } catch {
    // localStorage unavailable — nothing to do.
  }
}

/**
 * Resolves today's stored result, honoring a pending reset request first.
 * Never fires on its own — only when the documented flag has been set — so
 * normal production play is completely unaffected.
 */
export function resolveTodayResult(dateKey: string): PuzzleResult | null {
  if (isDevResetFlagSet()) {
    clearPuzzleResult(dateKey);
    clearDevResetFlag();
    return null;
  }
  return loadPuzzleResult(dateKey);
}
