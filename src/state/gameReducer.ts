import type { GameState } from '../core/types';
import { applyMove, isLegalMove } from '../core/rules';
import type { AppState, GameAction } from './types';

export function createInitialAppState(game: GameState): AppState {
  return { game, isAiThinking: false };
}

export function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case 'PLAY_MOVE': {
      if (!isLegalMove(state.game, action.move)) return state;
      return { game: applyMove(state.game, action.move), isAiThinking: false };
    }
    case 'SET_AI_THINKING':
      return { ...state, isAiThinking: action.thinking };
    default:
      return state;
  }
}
