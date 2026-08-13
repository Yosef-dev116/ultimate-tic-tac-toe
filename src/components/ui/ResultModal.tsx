import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { PuzzleResult } from '../../puzzle/puzzleStorage';
import { buildShareText } from '../../puzzle/shareResult';
import { HUMAN_PLAYER } from '../../lib/constants';
import { formatDurationShort, getMsUntilNextUtcDay } from '../../lib/date';
import { springSoft } from '../../animations/variants';

interface ResultModalProps {
  result: PuzzleResult;
}

export function ResultModal({ result }: ResultModalProps) {
  const [copied, setCopied] = useState(false);
  const shareText = useMemo(() => buildShareText(result), [result]);

  const outcomeText =
    result.outcome === HUMAN_PLAYER ? 'You Won!' : result.outcome === 'draw' ? "It's a Draw" : 'AI Wins';
  const nextPuzzleIn = formatDurationShort(getMsUntilNextUtcDay());

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ultimate Tic-Tac-Toe', text: shareText });
      } catch {
        // user dismissed the native share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the share text is still visible in the modal
    }
  }

  return (
    <div className="result-modal-backdrop">
      <motion.div
        className="result-modal"
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springSoft}
      >
        <h2 className="result-modal__title">{outcomeText}</h2>
        <p className="result-modal__meta">
          Puzzle #{result.puzzleNumber} · {result.moveCount} moves
        </p>
        <pre className="result-modal__grid">{shareText}</pre>
        <button type="button" className="button button--primary" onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Result'}
        </button>
        <p className="result-modal__footnote">New puzzle in {nextPuzzleIn} (resets at 00:00 UTC).</p>
      </motion.div>
    </div>
  );
}
