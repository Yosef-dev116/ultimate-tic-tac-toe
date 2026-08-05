import type { GameState } from '../core/types';
import { applyMove, createInitialState, getLegalMoves } from '../core/rules';
import { createRng } from '../lib/rng';
import { HUMAN_PLAYER } from '../lib/constants';

/**
 * Deterministic opening moves applied before the human takes over.
 * Kept even (X then O) so the human — always X — is the one to move next.
 */
const OPENING_PLIES = 2;

/** Generates today's starting position: same seed always produces the same opening. */
export function generateDailyPuzzle(seed: number): GameState {
  const rng = createRng(seed);
  let state = createInitialState(HUMAN_PLAYER);

  for (let ply = 0; ply < OPENING_PLIES; ply++) {
    const legalMoves = getLegalMoves(state);
    if (legalMoves.length === 0 || state.winner) break;
    const move = legalMoves[Math.floor(rng() * legalMoves.length)];
    state = applyMove(state, move);
  }

  return state;
}
