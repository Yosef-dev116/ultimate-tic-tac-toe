import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { Player } from '../core/types';
import { HUMAN_PLAYER } from '../lib/constants';
import { isNativeApp } from './platform';

export type OutcomeHaptic = 'success' | 'error' | 'warning';

/** Win feels like success, a loss like an error, a draw like a soft warning. */
export function outcomeHaptic(outcome: Player | 'draw'): OutcomeHaptic {
  if (outcome === 'draw') return 'warning';
  return outcome === HUMAN_PLAYER ? 'success' : 'error';
}

const NOTIFICATION_TYPES: Record<OutcomeHaptic, NotificationType> = {
  success: NotificationType.Success,
  error: NotificationType.Error,
  warning: NotificationType.Warning,
};

/** Haptics are a nicety. Never let a missing or failing haptic engine break the game. */
function safely(run: () => Promise<void>): void {
  if (!isNativeApp()) return;
  run().catch(() => {});
}

export function hapticMovePlaced(): void {
  safely(() => Haptics.impact({ style: ImpactStyle.Light }));
}

export function hapticOutcome(outcome: Player | 'draw'): void {
  safely(() => Haptics.notification({ type: NOTIFICATION_TYPES[outcomeHaptic(outcome)] }));
}
