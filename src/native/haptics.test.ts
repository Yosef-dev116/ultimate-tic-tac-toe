import { describe, expect, it } from 'vitest';
import { outcomeHaptic } from './haptics';

describe('outcomeHaptic', () => {
  it('maps a human win to success', () => {
    expect(outcomeHaptic('X')).toBe('success');
  });

  it('maps an AI win to error', () => {
    expect(outcomeHaptic('O')).toBe('error');
  });

  it('maps a draw to warning', () => {
    expect(outcomeHaptic('draw')).toBe('warning');
  });
});
