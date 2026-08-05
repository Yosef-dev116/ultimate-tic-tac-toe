import { useMemo } from 'react';
import { useGame } from '../state/useGame';
import type { PuzzleResult } from '../puzzle/puzzleStorage';
import { Header } from './ui/Header';
import { StatusBar } from './ui/StatusBar';
import { ResultModal } from './ui/ResultModal';
import { MetaBoard } from './board/MetaBoard';
import { CompletedBoardSummary } from './board/CompletedBoardSummary';
import { DevResetButton } from './dev/DevResetButton';

export function GameScreen() {
  const { game, dateKey, puzzleNumber, alreadyCompleted } = useGame();

  const liveResult: PuzzleResult | null = useMemo(() => {
    if (!game.winner) return null;
    return {
      dateKey,
      puzzleNumber,
      outcome: game.winner,
      moveCount: game.history.length,
      boardStatus: game.boardStatus,
    };
  }, [game.winner, game.history.length, game.boardStatus, dateKey, puzzleNumber]);

  const result = alreadyCompleted ?? liveResult;

  return (
    <>
      <Header puzzleNumber={puzzleNumber} />
      <StatusBar />
      {alreadyCompleted ? (
        <CompletedBoardSummary boardStatus={alreadyCompleted.boardStatus} />
      ) : (
        <MetaBoard />
      )}
      {result && <ResultModal result={result} />}
      {import.meta.env.DEV && <DevResetButton />}
    </>
  );
}
