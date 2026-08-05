import type { BoardStatus, GameState, MiniBoard, Move, Player } from './types';
import { checkBoardStatus, checkMetaWinner } from './winDetection';

export function createEmptyBoards(): MiniBoard[] {
  return Array.from({ length: 9 }, () => Array<null>(9).fill(null));
}

export function createInitialState(startingPlayer: Player = 'X'): GameState {
  return {
    boards: createEmptyBoards(),
    boardStatus: Array<BoardStatus>(9).fill(null),
    activeBoard: null,
    currentPlayer: startingPlayer,
    winner: null,
    history: [],
  };
}

/** A mini-board can still be played in if it hasn't been won or drawn. */
function isBoardOpen(boardStatus: BoardStatus[], boardIndex: number): boolean {
  return boardStatus[boardIndex] === null;
}

/** All legal moves for the current player, respecting the active-board redirect rule. */
export function getLegalMoves(state: GameState): Move[] {
  if (state.winner) return [];

  const candidateBoards =
    state.activeBoard !== null && isBoardOpen(state.boardStatus, state.activeBoard)
      ? [state.activeBoard]
      : state.boardStatus
          .map((_status: BoardStatus, index: number) => index)
          .filter((index: number) => isBoardOpen(state.boardStatus, index));

  const moves: Move[] = [];
  for (const boardIndex of candidateBoards) {
    const board = state.boards[boardIndex];
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (board[cellIndex] === null) {
        moves.push({ boardIndex, cellIndex });
      }
    }
  }
  return moves;
}

export function isLegalMove(state: GameState, move: Move): boolean {
  if (state.winner) return false;
  if (!isBoardOpen(state.boardStatus, move.boardIndex)) return false;
  if (state.activeBoard !== null && move.boardIndex !== state.activeBoard) return false;
  return state.boards[move.boardIndex][move.cellIndex] === null;
}

/** Applies a move and returns a brand-new state. Assumes the move has already been validated. */
export function applyMove(state: GameState, move: Move): GameState {
  const { boardIndex, cellIndex } = move;
  const player = state.currentPlayer;

  const nextBoards = state.boards.map((board: MiniBoard, index: number) =>
    index === boardIndex ? board.map((cell, i) => (i === cellIndex ? player : cell)) : board,
  );

  const nextBoardStatus = [...state.boardStatus];
  nextBoardStatus[boardIndex] = checkBoardStatus(nextBoards[boardIndex]);

  const winner = checkMetaWinner(nextBoardStatus);

  const nextActiveBoardRaw = cellIndex;
  const nextActiveBoard = isBoardOpen(nextBoardStatus, nextActiveBoardRaw) ? nextActiveBoardRaw : null;

  return {
    boards: nextBoards,
    boardStatus: nextBoardStatus,
    activeBoard: winner ? null : nextActiveBoard,
    currentPlayer: player === 'X' ? 'O' : 'X',
    winner,
    history: [...state.history, move],
  };
}
