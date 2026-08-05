import { describe, expect, it } from 'vitest';
import { checkBoardStatus, checkMetaWinner, getWinningLine } from './winDetection';
import type { BoardStatus, MiniBoard } from './types';

describe('checkBoardStatus', () => {
  it('is in-progress when empty', () => {
    const cells: MiniBoard = Array(9).fill(null);
    expect(checkBoardStatus(cells)).toBeNull();
  });

  it('detects a row win', () => {
    const cells: MiniBoard = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
    expect(checkBoardStatus(cells)).toBe('X');
  });

  it('detects a column win', () => {
    const cells: MiniBoard = ['O', null, null, 'O', 'X', 'X', 'O', null, null];
    expect(checkBoardStatus(cells)).toBe('O');
  });

  it('detects a diagonal win', () => {
    const cells: MiniBoard = ['X', 'O', null, 'O', 'X', null, null, null, 'X'];
    expect(checkBoardStatus(cells)).toBe('X');
  });

  it('is a draw when full with no line', () => {
    const cells: MiniBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkBoardStatus(cells)).toBe('draw');
  });

  it('is still in-progress when not full and no line', () => {
    const cells: MiniBoard = ['X', 'O', null, null, null, null, null, null, null];
    expect(checkBoardStatus(cells)).toBeNull();
  });
});

describe('checkMetaWinner', () => {
  it('detects a meta win across three won mini-boards', () => {
    const status: BoardStatus[] = ['X', 'X', 'X', null, 'O', null, null, null, null];
    expect(checkMetaWinner(status)).toBe('X');
  });

  it('does not count a drawn mini-board toward either player', () => {
    const status: BoardStatus[] = ['X', 'draw', 'X', null, null, null, null, null, null];
    expect(checkMetaWinner(status)).toBeNull();
  });

  it('is a draw once every mini-board is resolved with no meta line', () => {
    const status: BoardStatus[] = ['X', 'O', 'X', 'O', 'draw', 'X', 'O', 'X', 'O'];
    expect(checkMetaWinner(status)).toBe('draw');
  });

  it('is still in-progress while boards remain open', () => {
    const status: BoardStatus[] = ['X', 'X', null, null, null, null, null, null, null];
    expect(checkMetaWinner(status)).toBeNull();
  });
});

describe('getWinningLine', () => {
  it('finds the matching line for the winner', () => {
    const status: BoardStatus[] = ['X', 'X', 'X', null, 'O', null, null, null, null];
    expect(getWinningLine(status, 'X')).toEqual([0, 1, 2]);
  });

  it('returns null when there is no line for that player', () => {
    const status: BoardStatus[] = ['X', 'O', null, null, null, null, null, null, null];
    expect(getWinningLine(status, 'X')).toBeNull();
  });
});
