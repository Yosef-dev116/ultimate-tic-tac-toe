import { motion } from 'motion/react';

const BULLETS = ['Win small boards.', "Your move decides your opponent's next board.", 'Win three small boards in a row.'];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

interface SummaryStepProps {
  active: boolean;
  onComplete: () => void;
}

export function SummaryStep({ active, onComplete }: SummaryStepProps) {
  return (
    <div className="tutorial-step tutorial-step--summary">
      <motion.ul
        className="tutorial-list"
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
        variants={container}
      >
        {BULLETS.map((bullet) => (
          <motion.li key={bullet} variants={item}>
            {bullet}
          </motion.li>
        ))}
      </motion.ul>
      <button type="button" className="button button--primary button--large" onClick={onComplete}>
        Play Today's Puzzle
      </button>
    </div>
  );
}
