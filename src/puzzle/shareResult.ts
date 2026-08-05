import type { PuzzleResult } from './puzzleStorage';
import { HUMAN_PLAYER } from '../lib/constants';

function emojiForBoard(status: PuzzleResult['boardStatus'][number]): string {
  if (status === HUMAN_PLAYER) return '🟩';
  if (status === 'draw') return '⬜';
  if (status === null) return '⬛';
  return '🟥';
}

/** Wordle-style shareable summary: outcome line plus a 3x3 emoji grid of mini-board results. */
export function buildShareText(result: PuzzleResult): string {
  const grid = [0, 1, 2]
    .map((row) =>
      [0, 1, 2].map((col) => emojiForBoard(result.boardStatus[row * 3 + col])).join(''),
    )
    .join('\n');

  const outcomeText =
    result.outcome === HUMAN_PLAYER ? 'Won' : result.outcome === 'draw' ? 'Drew' : 'Lost';
  const outcomeEmoji = result.outcome === HUMAN_PLAYER ? '🏆' : result.outcome === 'draw' ? '🤝' : '💀';

  return `Ultimate Tic-Tac-Toe #${result.puzzleNumber}\n${outcomeText} in ${result.moveCount} moves ${outcomeEmoji}\n\n${grid}`;
}
