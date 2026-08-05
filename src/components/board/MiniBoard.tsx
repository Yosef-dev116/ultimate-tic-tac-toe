import { AnimatePresence, motion } from 'motion/react';
import type { BoardStatus, MiniBoard as MiniBoardCells } from '../../core/types';
import { getWinningLine } from '../../core/winDetection';
import { Cell } from './Cell';
import { WinLine } from '../../animations/WinLine';
import { springSoft } from '../../animations/variants';

interface MiniBoardProps {
  cells: MiniBoardCells;
  status: BoardStatus;
  isActive: boolean;
  canPlay: boolean;
  onPlayCell: (cellIndex: number) => void;
}

export function MiniBoard({ cells, status, isActive, canPlay, onPlayCell }: MiniBoardProps) {
  const winningLine = status && status !== 'draw' ? getWinningLine(cells, status) : null;

  return (
    <motion.div
      className={`mini-board${status ? ' mini-board--closed' : ''}`}
      animate={{
        boxShadow: isActive
          ? '0 0 0 3px var(--accent), 0 8px 20px -8px var(--accent-border)'
          : '0 0 0 0px transparent',
        scale: isActive ? 1.015 : 1,
      }}
      transition={springSoft}
    >
      <div className="mini-board__grid">
        {cells.map((cell, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cell}
            disabled={!canPlay}
            onClick={() => onPlayCell(cellIndex)}
          />
        ))}
      </div>

      {winningLine && <WinLine pattern={winningLine} thickness={3} />}

      <AnimatePresence>
        {status && (
          <motion.div
            className={`mini-board__stamp${status !== 'draw' ? ` mini-board__stamp--${status.toLowerCase()}` : ' mini-board__stamp--draw'}`}
            initial={{ scale: 0, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.2 }}
          >
            {status === 'draw' ? '—' : status}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
