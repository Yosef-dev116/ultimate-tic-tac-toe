import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { Move } from '../core/types';
import { isLegalMove } from '../core/rules';
import { getBestMove } from '../ai/minimax';
import { getDailySeed } from '../puzzle/dailySeed';
import { generateDailyPuzzle } from '../puzzle/puzzleGenerator';
import { savePuzzleResult, type PuzzleResult } from '../puzzle/puzzleStorage';
import { resolveTodayResult } from '../puzzle/devReset';
import { getPuzzleNumber, getUtcDateKey } from '../lib/date';
import { AI_PLAYER, HUMAN_PLAYER } from '../lib/constants';
import { createInitialAppState, gameReducer } from './gameReducer';
import { GameContext, type GameContextValue } from './GameContext';

/** Small delay before the AI replies — makes it read as "thinking" instead of instant/robotic. */
const AI_THINK_DELAY_MS = 550;

export function GameProvider({ children }: { children: ReactNode }) {
  const dateKey = useMemo(() => getUtcDateKey(), []);
  const puzzleNumber = useMemo(() => getPuzzleNumber(dateKey), [dateKey]);
  const [alreadyCompleted] = useState<PuzzleResult | null>(() => resolveTodayResult(dateKey));

  const initialGame = useMemo(() => generateDailyPuzzle(getDailySeed(dateKey)), [dateKey]);
  const [state, dispatch] = useReducer(gameReducer, initialGame, createInitialAppState);

  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (alreadyCompleted || !state.game.winner || hasSavedRef.current) return;
    hasSavedRef.current = true;
    savePuzzleResult({
      dateKey,
      puzzleNumber,
      outcome: state.game.winner,
      moveCount: state.game.history.length,
      boardStatus: state.game.boardStatus,
    });
  }, [alreadyCompleted, dateKey, puzzleNumber, state.game.winner, state.game.history.length, state.game.boardStatus]);

  useEffect(() => {
    if (alreadyCompleted || state.game.winner || state.game.currentPlayer !== AI_PLAYER) return;

    dispatch({ type: 'SET_AI_THINKING', thinking: true });
    const timeoutId = window.setTimeout(() => {
      const move = getBestMove(state.game, AI_PLAYER);
      dispatch({ type: 'PLAY_MOVE', move });
    }, AI_THINK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [alreadyCompleted, state.game]);

  const playMove = (boardIndex: number, cellIndex: number) => {
    if (alreadyCompleted || state.game.currentPlayer !== HUMAN_PLAYER || state.isAiThinking) return;
    const move: Move = { boardIndex, cellIndex };
    if (!isLegalMove(state.game, move)) return;
    dispatch({ type: 'PLAY_MOVE', move });
  };

  const value: GameContextValue = {
    game: state.game,
    dateKey,
    puzzleNumber,
    isAiThinking: state.isAiThinking,
    alreadyCompleted,
    isHumanTurn:
      !alreadyCompleted && !state.game.winner && state.game.currentPlayer === HUMAN_PLAYER && !state.isAiThinking,
    playMove,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
