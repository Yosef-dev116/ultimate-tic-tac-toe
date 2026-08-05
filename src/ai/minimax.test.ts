import { describe, expect, it } from 'vitest';
import { getBestMove } from './minimax';
import { applyMove, createEmptyBoards, createInitialState, isLegalMove } from '../core/rules';
import type { GameState } from '../core/types';

describe('getBestMove', () => {
  it('takes an immediate winning move over any other option', () => {
    const boards = createEmptyBoards();
    boards[0] = ['O', 'O', 'O', null, null, null, null, null, null];
    boards[1] = ['O', 'O', 'O', null, null, null, null, null, null];
    boards[2] = ['O', 'O', null, null, null, null, null, null, null];

    const state: GameState = {
      boards,
      boardStatus: ['O', 'O', null, null, null, null, null, null, null],
      activeBoard: 2,
      currentPlayer: 'O',
      winner: null,
      history: [],
    };

    expect(getBestMove(state, 'O')).toEqual({ boardIndex: 2, cellIndex: 2 });
  });

  it('always returns a legal move from a fresh game', () => {
    const state = createInitialState();
    const move = getBestMove(state, 'O', 4);
    expect(isLegalMove(state, move)).toBe(true);
  });

  it('always returns a legal move a few plies into the opening', () => {
    let state = createInitialState();
    state = applyMove(state, { boardIndex: 4, cellIndex: 4 });
    state = applyMove(state, { boardIndex: 4, cellIndex: 0 });
    state = applyMove(state, { boardIndex: 0, cellIndex: 6 });

    const move = getBestMove(state, 'O', 4);
    expect(isLegalMove(state, move)).toBe(true);
  });

  it('is fast enough not to block the UI at the default search depth', () => {
    const state = createInitialState();
    const start = performance.now();
    getBestMove(state, 'O');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  it('throws when there are no legal moves', () => {
    const state: GameState = { ...createInitialState(), winner: 'X' };
    expect(() => getBestMove(state, 'O')).toThrow();
  });
});
