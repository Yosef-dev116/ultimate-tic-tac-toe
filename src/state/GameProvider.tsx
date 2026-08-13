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

/**
 * How often to re-check the real UTC date against what the app is currently showing.
 * A web app can stay open (tab left open, phone browser suspended/resumed, laptop sleep)
 * across a UTC midnight boundary without ever remounting, so `dateKey` can't just be
 * computed once — it has to be actively watched for as long as the app is running.
 */
const DATE_CHECK_INTERVAL_MS = 60_000;

export function GameProvider({ children }: { children: ReactNode }) {
  const [dateKey, setDateKey] = useState(() => getUtcDateKey());

  useEffect(() => {
    function checkForNewDay() {
      const current = getUtcDateKey();
      setDateKey((previous) => (previous === current ? previous : current));
    }

    // Poll as a safety net, but also react immediately when the tab regains
    // focus/visibility — the far more common real-world trigger for a stale date.
    const intervalId = window.setInterval(checkForNewDay, DATE_CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', checkForNewDay);
    window.addEventListener('focus', checkForNewDay);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', checkForNewDay);
      window.removeEventListener('focus', checkForNewDay);
    };
  }, []);

  // Remounting the session by date key resets every piece of day-scoped state
  // (today's completion lookup, the generated puzzle, and in-progress moves)
  // together, the same way a fresh page load would.
  return (
    <DailySession key={dateKey} dateKey={dateKey}>
      {children}
    </DailySession>
  );
}

interface DailySessionProps {
  dateKey: string;
  children: ReactNode;
}

function DailySession({ dateKey, children }: DailySessionProps) {
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
