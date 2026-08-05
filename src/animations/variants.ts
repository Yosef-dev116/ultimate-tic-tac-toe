import type { Transition } from 'motion/react';

/** Shared motion vocabulary — every animation in the app draws from this small set. */
export const springSnappy: Transition = { type: 'spring', stiffness: 500, damping: 30 };
export const springSoft: Transition = { type: 'spring', stiffness: 300, damping: 26 };
export const easeOut: Transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };
