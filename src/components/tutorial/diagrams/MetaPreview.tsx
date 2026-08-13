import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { springSoft } from '../../../animations/variants';

export type PreviewCellState = 'idle' | 'target' | 'available' | 'x' | 'o' | 'draw';

interface MetaPreviewProps {
  cellStates: readonly PreviewCellState[];
  children?: ReactNode;
}

const LABEL: Partial<Record<PreviewCellState, string>> = { x: 'X', o: 'O', draw: '—' };

/** A simplified 3x3 preview of the meta-board — each cell represents a whole mini-board. */
export function MetaPreview({ cellStates, children }: MetaPreviewProps) {
  return (
    <div className="tutorial-meta-preview">
      <div className="tutorial-meta-preview__grid">
        {cellStates.map((state, index) => (
          <motion.div
            key={index}
            className={`tutorial-meta-preview__cell tutorial-meta-preview__cell--${state}`}
            animate={{ scale: state === 'target' || state === 'available' ? 1.06 : 1 }}
            transition={springSoft}
          >
            {LABEL[state] ?? ''}
          </motion.div>
        ))}
      </div>
      {children}
    </div>
  );
}
