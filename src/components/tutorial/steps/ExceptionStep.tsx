import { MetaPreview, type PreviewCellState } from '../diagrams/MetaPreview';
import { useStepCycle } from '../diagrams/useStepCycle';

function buildFrame(othersAvailable: boolean): PreviewCellState[] {
  const states: PreviewCellState[] = Array(9).fill('idle');
  states[4] = 'x';
  if (othersAvailable) {
    for (let i = 0; i < states.length; i++) {
      if (i !== 4) states[i] = 'available';
    }
  }
  return states;
}

const FRAMES: PreviewCellState[][] = [buildFrame(false), buildFrame(true)];
const CAPTIONS = ['This board is already won…', '…so they may play in ANY open board!'];

interface ExceptionStepProps {
  active: boolean;
}

export function ExceptionStep({ active }: ExceptionStepProps) {
  const frame = useStepCycle(active, FRAMES.length, 1400);

  return (
    <div className="tutorial-step">
      <p className="tutorial-step__text">
        If your opponent is sent to a board that's already won or completely full, they may play in
        any unfinished board instead.
      </p>
      <MetaPreview cellStates={FRAMES[frame]} />
      <p className="tutorial-step__caption">{CAPTIONS[frame]}</p>
    </div>
  );
}
