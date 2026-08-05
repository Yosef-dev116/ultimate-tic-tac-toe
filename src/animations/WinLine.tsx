import { motion } from 'motion/react';

interface LineGeometry {
  x: number;
  y: number;
  angle: number;
  length: number;
}

const LINE_GEOMETRY: Record<string, LineGeometry> = {
  '0,1,2': { x: 50, y: 16.67, angle: 0, length: 100 },
  '3,4,5': { x: 50, y: 50, angle: 0, length: 100 },
  '6,7,8': { x: 50, y: 83.33, angle: 0, length: 100 },
  '0,3,6': { x: 16.67, y: 50, angle: 90, length: 100 },
  '1,4,7': { x: 50, y: 50, angle: 90, length: 100 },
  '2,5,8': { x: 83.33, y: 50, angle: 90, length: 100 },
  '0,4,8': { x: 50, y: 50, angle: 45, length: 133 },
  '2,4,6': { x: 50, y: 50, angle: -45, length: 133 },
};

interface WinLineProps {
  pattern: readonly [number, number, number];
  thickness?: number;
  delay?: number;
}

/** Animated bar drawn across a winning line — reused at both mini-board and meta-board scale. */
export function WinLine({ pattern, thickness = 4, delay = 0.15 }: WinLineProps) {
  const geometry = LINE_GEOMETRY[pattern.join(',')];
  if (!geometry) return null;

  return (
    <div className="win-line-layer" aria-hidden="true">
      <motion.div
        className="win-line"
        style={{
          left: `${geometry.x}%`,
          top: `${geometry.y}%`,
          width: `${geometry.length}%`,
          height: thickness,
          x: '-50%',
          y: '-50%',
          rotate: geometry.angle,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </div>
  );
}
