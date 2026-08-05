import type { BoardStatus, CellValue, MiniBoard, Player } from './types';
import { WIN_LINES } from './types';

/** Resolves a single mini-board's status from its 9 cells. */
export function checkBoardStatus(cells: MiniBoard): BoardStatus {
  for (const [a, b, c] of WIN_LINES) {
    const value = cells[a];
    if (value && value === cells[b] && value === cells[c]) {
      return value;
    }
  }
  if (cells.every((cell: CellValue) => cell !== null)) {
    return 'draw';
  }
  return null;
}

/** Resolves the overall game winner from the 9 mini-board statuses. */
export function checkMetaWinner(boardStatus: BoardStatus[]): BoardStatus {
  for (const [a, b, c] of WIN_LINES) {
    const value = boardStatus[a];
    if (value && value !== 'draw' && value === boardStatus[b] && value === boardStatus[c]) {
      return value;
    }
  }
  if (boardStatus.every((status: BoardStatus) => status !== null)) {
    return 'draw';
  }
  return null;
}

/** Finds which of the 8 lines produced the win, for drawing a win-line overlay. */
export function getWinningLine(
  values: readonly BoardStatus[],
  winner: Player,
): readonly [number, number, number] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (values[a] === winner && values[b] === winner && values[c] === winner) {
      return line;
    }
  }
  return null;
}
