import { motion } from 'motion/react';

const LINES = [
  'Every day, everyone gets the same puzzle.',
  'You play against the AI.',
  'Your goal is to win the big board.',
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

interface WelcomeStepProps {
  active: boolean;
}

export function WelcomeStep({ active }: WelcomeStepProps) {
  return (
    <div className="tutorial-step">
      <motion.ul
        className="tutorial-list"
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
        variants={container}
      >
        {LINES.map((line) => (
          <motion.li key={line} variants={item}>
            {line}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
