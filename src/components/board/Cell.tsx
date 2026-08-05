import { AnimatePresence, motion } from 'motion/react';
import type { CellValue } from '../../core/types';
import { springSnappy } from '../../animations/variants';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
}

export function Cell({ value, onClick, disabled }: CellProps) {
  return (
    <button
      type="button"
      className={`cell${value ? ` cell--${value.toLowerCase()}` : ''}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Played ${value}` : 'Empty cell'}
    >
      <AnimatePresence>
        {value && (
          <motion.span
            className="cell__mark"
            initial={{ scale: 0, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={springSnappy}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
