import type { BoardStatus, Player } from '../core/types';

export interface PuzzleResult {
  dateKey: string;
  puzzleNumber: number;
  outcome: Player | 'draw';
  moveCount: number;
  boardStatus: BoardStatus[];
}

export const PUZZLE_RESULT_STORAGE_PREFIX = 'uttt-daily-result-';
const STORAGE_PREFIX = PUZZLE_RESULT_STORAGE_PREFIX;

export function loadPuzzleResult(dateKey: string): PuzzleResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + dateKey);
    return raw ? (JSON.parse(raw) as PuzzleResult) : null;
  } catch {
    return null;
  }
}

export function savePuzzleResult(result: PuzzleResult): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + result.dateKey, JSON.stringify(result));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — non-critical.
  }
}

export function clearPuzzleResult(dateKey: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + dateKey);
  } catch {
    // localStorage unavailable — nothing to clear.
  }
}
