import { AnimatePresence, motion } from 'motion/react';
import type { CellValue } from '../../../core/types';
import { TinyBoard } from '../diagrams/TinyBoard';
import { MetaPreview, type PreviewCellState } from '../diagrams/MetaPreview';
import { useStepCycle } from '../diagrams/useStepCycle';

interface Example {
  cellIndex: number;
  boardIndex: number;
  label: string;
}

const EXAMPLES: Example[] = [
  { cellIndex: 4, boardIndex: 4, label: 'Center cell → center board' },
  { cellIndex: 8, boardIndex: 8, label: 'Bottom-right cell → bottom-right board' },
];
const PHASES_PER_EXAMPLE = 3;

interface RedirectStepProps {
  active: boolean;
}

export function RedirectStep({ active }: RedirectStepProps) {
  const frame = useStepCycle(active, EXAMPLES.length * PHASES_PER_EXAMPLE, 900);
  const exampleIndex = Math.floor(frame / PHASES_PER_EXAMPLE);
  const phase = frame % PHASES_PER_EXAMPLE;
  const example = EXAMPLES[exampleIndex];

  const sourceCells: CellValue[] = Array(9).fill(null);
  if (phase >= 1) sourceCells[example.cellIndex] = 'X';

  const targetStates: PreviewCellState[] = Array(9).fill('idle');
  if (phase >= 2) targetStates[example.boardIndex] = 'target';

  return (
    <div className="tutorial-step">
      <p className="tutorial-step__text tutorial-step__text--emphasis">
        The square you choose determines which small board your opponent must play in next.
      </p>

      <div className="tutorial-redirect">
        <div className="tutorial-redirect__side">
          <span className="tutorial-redirect__label">You play here</span>
          <TinyBoard cells={sourceCells} />
        </div>
        <div className="tutorial-redirect__arrow" aria-hidden="true">
          →
        </div>
        <div className="tutorial-redirect__side">
          <span className="tutorial-redirect__label">They must play here</span>
          <MetaPreview cellStates={targetStates} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={exampleIndex}
          className="tutorial-step__caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {example.label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
