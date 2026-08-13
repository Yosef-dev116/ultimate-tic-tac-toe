import { WinLine } from '../../../animations/WinLine';
import { MetaPreview, type PreviewCellState } from '../diagrams/MetaPreview';
import { useStepCycle } from '../diagrams/useStepCycle';

const IDLE_ROW: PreviewCellState[] = ['idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle'];

const FRAMES: PreviewCellState[][] = [
  IDLE_ROW,
  ['x', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle'],
  ['x', 'x', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle'],
  ['x', 'x', 'x', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle'],
  ['x', 'x', 'x', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle'],
];

interface WinBigBoardStepProps {
  active: boolean;
}

export function WinBigBoardStep({ active }: WinBigBoardStepProps) {
  const frame = useStepCycle(active, FRAMES.length, 700);
  const showWin = frame >= 3;

  return (
    <div className="tutorial-step">
      <p className="tutorial-step__text">Winning three small boards in a row wins the game.</p>
      <MetaPreview cellStates={FRAMES[frame]}>
        {showWin && <WinLine pattern={[0, 1, 2]} thickness={5} delay={0.05} />}
      </MetaPreview>
    </div>
  );
}
