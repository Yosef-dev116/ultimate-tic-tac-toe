import type { CellValue } from '../../../core/types';
import { WinLine } from '../../../animations/WinLine';
import { TinyBoard } from '../diagrams/TinyBoard';
import { useStepCycle } from '../diagrams/useStepCycle';

const FRAMES: CellValue[][] = [
  [null, null, null, null, null, null, null, null, null],
  ['X', null, null, null, null, null, null, null, null],
  ['X', 'X', null, null, null, null, null, null, null],
  ['X', 'X', 'X', null, null, null, null, null, null],
  ['X', 'X', 'X', null, null, null, null, null, null],
];

interface WinBoardsStepProps {
  active: boolean;
}

export function WinBoardsStep({ active }: WinBoardsStepProps) {
  const frame = useStepCycle(active, FRAMES.length, 700);
  const showWin = frame >= 3;

  return (
    <div className="tutorial-step">
      <p className="tutorial-step__text">
        Each large square contains a normal tic-tac-toe board. Win three in a row to claim it.
      </p>
      <TinyBoard cells={FRAMES[frame]}>
        {showWin && <WinLine pattern={[0, 1, 2]} thickness={3} delay={0.05} />}
      </TinyBoard>
    </div>
  );
}
