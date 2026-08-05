import type { GameState, Move } from '../core/types';

export interface AppState {
  game: GameState;
  isAiThinking: boolean;
}

export type GameAction = { type: 'PLAY_MOVE'; move: Move } | { type: 'SET_AI_THINKING'; thinking: boolean };
