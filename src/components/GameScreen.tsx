import { useMemo } from 'react';
import { useGame } from '../state/useGame';
import type { PuzzleResult } from '../puzzle/puzzleStorage';
import { Header } from './ui/Header';
import { StatusBar } from './ui/StatusBar';
import { ResultModal } from './ui/ResultModal';
import { MetaBoard } from './board/MetaBoard';
import { CompletedBoardSummary } from './board/CompletedBoardSummary';
import { DevResetButton } from './dev/DevResetButton';
import { TutorialModal } from './tutorial/TutorialModal';
import { useTutorial } from './tutorial/useTutorial';

export function GameScreen() {
  const { game, dateKey, puzzleNumber, alreadyCompleted } = useGame();
  const tutorial = useTutorial();

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
      <Header puzzleNumber={puzzleNumber} onOpenTutorial={tutorial.open} />
      <StatusBar />
      {alreadyCompleted ? (
        <CompletedBoardSummary boardStatus={alreadyCompleted.boardStatus} />
      ) : (
        <MetaBoard />
      )}
      {result && <ResultModal result={result} />}
      <TutorialModal isOpen={tutorial.isOpen} dismissible={tutorial.dismissible} onClose={tutorial.close} />
      {import.meta.env.DEV && <DevResetButton />}
    </>
  );
}
