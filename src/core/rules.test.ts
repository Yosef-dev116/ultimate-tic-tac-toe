import { describe, expect, it } from 'vitest';
import { applyMove, createEmptyBoards, createInitialState, getLegalMoves, isLegalMove } from './rules';
import { checkBoardStatus } from './winDetection';
import type { BoardStatus, GameState } from './types';

describe('createInitialState', () => {
  it('starts empty with X to move and no active-board restriction', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('X');
    expect(state.activeBoard).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.boards.every((board) => board.every((cell) => cell === null))).toBe(true);
  });
});

describe('getLegalMoves', () => {
  it('allows any of the 81 cells on the very first move', () => {
    expect(getLegalMoves(createInitialState())).toHaveLength(81);
  });

  it('restricts the next player to the mini-board matching the cell just played', () => {
    const state = applyMove(createInitialState(), { boardIndex: 4, cellIndex: 2 });
    expect(state.activeBoard).toBe(2);
    const legalMoves = getLegalMoves(state);
    expect(legalMoves).toHaveLength(9);
    expect(legalMoves.every((m) => m.boardIndex === 2)).toBe(true);
  });

  it('gives a free choice across every open board when sent to a closed board', () => {
    const boards = createEmptyBoards();
    // A completed draw: X O X / X O O / O X X — no line, board fully occupied.
    boards[0] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const boardStatus: BoardStatus[] = boards.map((cells, i) => (i === 0 ? checkBoardStatus(cells) : null));
    expect(boardStatus[0]).toBe('draw');

    const state: GameState = {
      boards,
      boardStatus,
      activeBoard: 0,
      currentPlayer: 'X',
      winner: null,
      history: [],
    };

    const legalMoves = getLegalMoves(state);
    expect(legalMoves.every((m) => m.boardIndex !== 0)).toBe(true);
    expect(legalMoves).toHaveLength(8 * 9);
  });
});

describe('isLegalMove / applyMove', () => {
  it('rejects playing on an occupied cell', () => {
    const state = applyMove(createInitialState(), { boardIndex: 0, cellIndex: 0 });
    expect(isLegalMove(state, { boardIndex: 0, cellIndex: 0 })).toBe(false);
  });

  it('rejects playing outside the active board', () => {
    const state = applyMove(createInitialState(), { boardIndex: 4, cellIndex: 0 });
    expect(state.activeBoard).toBe(0);
    expect(isLegalMove(state, { boardIndex: 1, cellIndex: 0 })).toBe(false);
    expect(isLegalMove(state, { boardIndex: 0, cellIndex: 1 })).toBe(true);
  });

  it('rejects every move once the game has a winner', () => {
    const state: GameState = { ...createInitialState(), winner: 'X' };
    expect(isLegalMove(state, { boardIndex: 0, cellIndex: 0 })).toBe(false);
    expect(getLegalMoves(state)).toEqual([]);
  });

  it('alternates the current player after every move', () => {
    const state = applyMove(createInitialState(), { boardIndex: 0, cellIndex: 0 });
    expect(state.currentPlayer).toBe('O');
    expect(state.boards[0][0]).toBe('X');
  });

  it('appends to history without mutating the previous state', () => {
    const initial = createInitialState();
    const next = applyMove(initial, { boardIndex: 0, cellIndex: 0 });
    expect(initial.history).toHaveLength(0);
    expect(next.history).toHaveLength(1);
    expect(initial.boards[0][0]).toBeNull();
  });

  it('resolves a mini-board win and a simultaneous meta-board win on the same move', () => {
    const boards = createEmptyBoards();
    boards[0] = ['X', 'X', 'X', null, null, null, null, null, null];
    boards[1] = ['X', 'X', 'X', null, null, null, null, null, null];
    boards[2] = ['X', 'X', null, null, null, null, null, null, null];

    const state: GameState = {
      boards,
      boardStatus: ['X', 'X', null, null, null, null, null, null, null],
      activeBoard: 2,
      currentPlayer: 'X',
      winner: null,
      history: [],
    };

    const result = applyMove(state, { boardIndex: 2, cellIndex: 2 });
    expect(result.boardStatus[2]).toBe('X');
    expect(result.winner).toBe('X');
  });

  it('sends the opponent to a free choice once the target board is won', () => {
    const boards = createEmptyBoards();
    boards[2] = ['O', 'O', null, null, null, null, null, null, null];
    const state: GameState = {
      boards,
      boardStatus: Array(9).fill(null),
      activeBoard: 2,
      currentPlayer: 'O',
      winner: null,
      history: [],
    };

    // O completes board 2 by playing cell 2, which would normally redirect to board 2 —
    // but board 2 is now closed, so the next player gets a free choice.
    const result = applyMove(state, { boardIndex: 2, cellIndex: 2 });
    expect(result.boardStatus[2]).toBe('O');
    expect(result.activeBoard).toBeNull();
  });
});
