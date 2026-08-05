import type { GameState, Move, Player } from '../core/types';
import { applyMove, getLegalMoves } from '../core/rules';
import { evaluate } from './evaluate';

export const DEFAULT_SEARCH_DEPTH = 5;

/** Cheap move ordering (center-first) to help alpha-beta prune more aggressively. */
function orderMoves(moves: Move[]): Move[] {
  const weight = (i: number) => (i === 4 ? 0 : i % 2 === 0 ? 1 : 2);
  return [...moves].sort(
    (a, b) => weight(a.boardIndex) + weight(a.cellIndex) - (weight(b.boardIndex) + weight(b.cellIndex)),
  );
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiPlayer: Player,
): number {
  if (state.winner || depth === 0) {
    return evaluate(state, aiPlayer, depth);
  }

  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) {
    return evaluate(state, aiPlayer, depth);
  }

  if (maximizing) {
    let value = -Infinity;
    for (const move of orderMoves(legalMoves)) {
      value = Math.max(value, minimax(applyMove(state, move), depth - 1, alpha, beta, false, aiPlayer));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }

  let value = Infinity;
  for (const move of orderMoves(legalMoves)) {
    value = Math.min(value, minimax(applyMove(state, move), depth - 1, alpha, beta, true, aiPlayer));
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
}

/** Picks the best move for aiPlayer via depth-limited minimax with alpha-beta pruning. */
export function getBestMove(state: GameState, aiPlayer: Player, depth: number = DEFAULT_SEARCH_DEPTH): Move {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) {
    throw new Error('getBestMove called with no legal moves available');
  }
  if (legalMoves.length === 1) {
    return legalMoves[0];
  }

  let bestMove = legalMoves[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of orderMoves(legalMoves)) {
    const score = minimax(applyMove(state, move), depth - 1, alpha, beta, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestScore);
  }

  return bestMove;
}
