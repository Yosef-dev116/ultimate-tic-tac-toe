import { AnimatePresence, motion } from 'motion/react';
import { useGame } from '../../state/useGame';
import { AI_PLAYER, HUMAN_PLAYER } from '../../lib/constants';
import type { BoardStatus, Player } from '../../core/types';

function getStatusText(winner: BoardStatus, currentPlayer: Player, alreadyCompleted: boolean): string {
  if (alreadyCompleted) return "You've already completed today's puzzle";
  if (winner === HUMAN_PLAYER) return 'You win! 🏆';
  if (winner === 'draw') return "It's a draw";
  if (winner) return 'AI wins this one';
  if (currentPlayer === AI_PLAYER) return 'AI is thinking…';
  return 'Your move';
}

export function StatusBar() {
  const { game, alreadyCompleted } = useGame();
  const text = getStatusText(game.winner, game.currentPlayer, Boolean(alreadyCompleted));

  return (
    <div className="status-bar" role="status">
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
