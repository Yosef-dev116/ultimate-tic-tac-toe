export type Player = 'X' | 'O';

export type CellValue = Player | null;

/** Outcome of a single mini-board. null means still in progress. */
export type BoardStatus = Player | 'draw' | null;

/** A single 3x3 mini-board, cells indexed 0-8 left-to-right, top-to-bottom. */
export type MiniBoard = CellValue[];

export interface Move {
  boardIndex: number;
  cellIndex: number;
}

export interface GameState {
  /** 9 mini-boards, each holding 9 cells. */
  boards: MiniBoard[];
  /** Resolved status of each of the 9 mini-boards. */
  boardStatus: BoardStatus[];
  /** Which mini-board the current player must play in, or null if free choice. */
  activeBoard: number | null;
  currentPlayer: Player;
  winner: BoardStatus;
  /** Moves played so far, in order. */
  history: Move[];
}

/** The 8 winning lines shared by every 3x3 board (mini or meta). */
export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
