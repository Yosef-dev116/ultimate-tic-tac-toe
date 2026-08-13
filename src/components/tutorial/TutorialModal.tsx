import { useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { springSoft } from '../../animations/variants';
import { WelcomeStep } from './steps/WelcomeStep';
import { WinBoardsStep } from './steps/WinBoardsStep';
import { RedirectStep } from './steps/RedirectStep';
import { WinBigBoardStep } from './steps/WinBigBoardStep';
import { ExceptionStep } from './steps/ExceptionStep';
import { SummaryStep } from './steps/SummaryStep';

interface StepDef {
  title: string;
  Component: ComponentType<{ active: boolean }>;
}

const STEPS: StepDef[] = [
  { title: 'Welcome to Daily Ultimate Tic-Tac-Toe', Component: WelcomeStep },
  { title: 'Win Small Boards', Component: WinBoardsStep },
  { title: 'Your Move Controls Their Next Move', Component: RedirectStep },
  { title: 'Win the Big Board', Component: WinBigBoardStep },
  { title: 'One Important Exception', Component: ExceptionStep },
];

const SUMMARY_TITLE = "You're Ready!";
const TOTAL_STEPS = STEPS.length + 1;

interface TutorialModalProps {
  isOpen: boolean;
  /** False during the mandatory first-run walkthrough — Escape/backdrop/close are disabled until the last step. */
  dismissible: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, dismissible, onClose }: TutorialModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [wasOpen, setWasOpen] = useState(isOpen);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Reset to the first step whenever the modal transitions from closed to open.
  // Adjusted directly during render (React's documented pattern for this) rather
  // than in an effect, since it's deriving state from a prop change, not syncing
  // with an external system.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setStepIndex(0);
      setDirection(1);
    }
  }

  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const canClose = dismissible || isLastStep;
  const currentStep = isLastStep ? null : STEPS[stepIndex];

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocusedRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (canClose) {
          event.preventDefault();
          onClose();
        }
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setDirection(1);
        setStepIndex((current) => Math.min(TOTAL_STEPS - 1, current + 1));
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setDirection(-1);
        setStepIndex((current) => Math.max(0, current - 1));
        return;
      }
      if (event.key === 'Tab') {
        const container = dialogRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canClose, onClose]);

  function handleNext() {
    setDirection(1);
    setStepIndex((current) => Math.min(TOTAL_STEPS - 1, current + 1));
  }

  function handlePrev() {
    setDirection(-1);
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function handleDotClick(index: number) {
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(index);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="tutorial-backdrop"
          onClick={(event) => {
            if (canClose && event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            className="tutorial-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
            tabIndex={-1}
            layout
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={springSoft}
          >
            <div className="tutorial-panel__header">
              <h2 id="tutorial-title" className="tutorial-panel__title">
                {isLastStep ? SUMMARY_TITLE : currentStep?.title}
              </h2>
              <button
                type="button"
                className="tutorial-panel__close"
                onClick={onClose}
                disabled={!canClose}
                aria-label="Close tutorial"
              >
                ✕
              </button>
            </div>

            <div className="tutorial-panel__body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: direction > 0 ? 32 : -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -32 : 32 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {currentStep ? (
                    <currentStep.Component active={isOpen} />
                  ) : (
                    <SummaryStep active={isOpen} onComplete={onClose} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="tutorial-panel__footer">
              <button
                type="button"
                className="tutorial-nav-button"
                onClick={handlePrev}
                disabled={stepIndex === 0}
              >
                Previous
              </button>

              <div className="tutorial-progress" role="tablist" aria-label="Tutorial progress">
                {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-label={`Go to step ${index + 1}`}
                    aria-current={index === stepIndex}
                    className={`tutorial-progress__dot${index === stepIndex ? ' tutorial-progress__dot--active' : ''}`}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="tutorial-nav-button tutorial-nav-button--primary"
                onClick={handleNext}
                style={isLastStep ? { visibility: 'hidden' } : undefined}
                aria-hidden={isLastStep}
                tabIndex={isLastStep ? -1 : undefined}
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
