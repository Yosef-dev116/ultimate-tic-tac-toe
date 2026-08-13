import { useState } from 'react';
import { hasSeenTutorial, markTutorialSeen } from '../../lib/tutorialStorage';

export interface TutorialController {
  isOpen: boolean;
  /** False during the mandatory first-run walkthrough; true once reopened from "How to Play". */
  dismissible: boolean;
  open: () => void;
  close: () => void;
}

export function useTutorial(): TutorialController {
  const [isOpen, setIsOpen] = useState(() => !hasSeenTutorial());
  const [dismissible, setDismissible] = useState(() => hasSeenTutorial());

  function open() {
    setDismissible(true);
    setIsOpen(true);
  }

  function close() {
    markTutorialSeen();
    setIsOpen(false);
  }

  return { isOpen, dismissible, open, close };
}
