import type { GameState, Player } from '../core/types';
import { WIN_LINES } from '../core/types';

export const WIN_SCORE = 1_000_000;

/** Positional value per cell/board index — center highest, corners next, edges least. */
const POSITION_VALUE = [3, 2, 3, 2, 4, 2, 3, 2, 3];

const LINE_WEIGHT_BY_COUNT = [0, 1, 10, 100];

const META_LINE_WEIGHT = 60;
const META_POSITION_WEIGHT = 12;
const MINI_LINE_WEIGHT = 3;
const MINI_POSITION_WEIGHT = 1;

function scoreLine(values: readonly (Player | 'draw' | null)[], player: Player, opponent: Player): number {
  if (values.includes('draw')) return 0;

  const playerCount = values.filter((v) => v === player).length;
  const opponentCount = values.filter((v) => v === opponent).length;

  if (playerCount > 0 && opponentCount > 0) return 0;
  if (playerCount > 0) return LINE_WEIGHT_BY_COUNT[playerCount];
  if (opponentCount > 0) return -LINE_WEIGHT_BY_COUNT[opponentCount];
  return 0;
}

/**
 * Static heuristic score of a non-terminal position from aiPlayer's perspective.
 * depthRemaining rewards faster wins / slower losses when the state is terminal.
 */
export function evaluate(state: GameState, aiPlayer: Player, depthRemaining = 0): number {
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';

  if (state.winner === aiPlayer) return WIN_SCORE + depthRemaining;
  if (state.winner === opponent) return -(WIN_SCORE + depthRemaining);
  if (state.winner === 'draw') return 0;

  let score = 0;

  for (const line of WIN_LINES) {
    const values = line.map((i) => state.boardStatus[i]);
    score += scoreLine(values, aiPlayer, opponent) * META_LINE_WEIGHT;
  }

  state.boardStatus.forEach((status, i) => {
    if (status === aiPlayer) score += POSITION_VALUE[i] * META_POSITION_WEIGHT;
    else if (status === opponent) score -= POSITION_VALUE[i] * META_POSITION_WEIGHT;
  });

  state.boards.forEach((board, boardIndex) => {
    if (state.boardStatus[boardIndex] !== null) return;

    for (const line of WIN_LINES) {
      const values = line.map((i) => board[i]);
      score += scoreLine(values, aiPlayer, opponent) * MINI_LINE_WEIGHT;
    }

    board.forEach((cell, i) => {
      if (cell === aiPlayer) score += POSITION_VALUE[i] * MINI_POSITION_WEIGHT;
      else if (cell === opponent) score -= POSITION_VALUE[i] * MINI_POSITION_WEIGHT;
    });
  });

  return score;
}
