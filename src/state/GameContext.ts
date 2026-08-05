import { createContext } from 'react';
import type { GameState } from '../core/types';
import type { PuzzleResult } from '../puzzle/puzzleStorage';

export interface GameContextValue {
  game: GameState;
  dateKey: string;
  puzzleNumber: number;
  isAiThinking: boolean;
  /** Set if this puzzle was already finished in a previous session today. */
  alreadyCompleted: PuzzleResult | null;
  isHumanTurn: boolean;
  playMove: (boardIndex: number, cellIndex: number) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);
