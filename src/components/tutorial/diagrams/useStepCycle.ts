import { useEffect, useState } from 'react';

/** Cycles 0..frameCount-1 on an interval while `active`; pauses (without resetting) when inactive. */
export function useStepCycle(active: boolean, frameCount: number, intervalMs: number): number {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % frameCount);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, frameCount, intervalMs]);

  return frame;
}
