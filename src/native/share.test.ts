import { describe, expect, it, vi } from 'vitest';
import { shareWithFallback, type ShareDeps } from './share';

function makeDeps(overrides: Partial<ShareDeps> = {}): ShareDeps {
  return {
    isNative: false,
    nativeShare: vi.fn().mockResolvedValue(undefined),
    webShare: vi.fn().mockResolvedValue(undefined),
    copyToClipboard: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('shareWithFallback', () => {
  it('uses the native share sheet in the app and nothing else', async () => {
    const deps = makeDeps({ isNative: true });
    await expect(shareWithFallback('hi', deps)).resolves.toBe('shared');
    expect(deps.nativeShare).toHaveBeenCalledWith('hi');
    expect(deps.webShare).not.toHaveBeenCalled();
    expect(deps.copyToClipboard).not.toHaveBeenCalled();
  });

  it('uses the Web Share API in a browser that has it', async () => {
    const deps = makeDeps();
    await expect(shareWithFallback('hi', deps)).resolves.toBe('shared');
    expect(deps.webShare).toHaveBeenCalledWith('hi');
    expect(deps.nativeShare).not.toHaveBeenCalled();
    expect(deps.copyToClipboard).not.toHaveBeenCalled();
  });

  it('copies to the clipboard when the browser has no Web Share API', async () => {
    const deps = makeDeps({ webShare: undefined });
    await expect(shareWithFallback('hi', deps)).resolves.toBe('copied');
    expect(deps.copyToClipboard).toHaveBeenCalledWith('hi');
  });

  it('does not fall back to the clipboard when the user dismisses the share sheet', async () => {
    const deps = makeDeps({ isNative: true, nativeShare: vi.fn().mockRejectedValue(new Error('cancelled')) });
    await expect(shareWithFallback('hi', deps)).resolves.toBe('shared');
    expect(deps.copyToClipboard).not.toHaveBeenCalled();
  });

  it('reports failure when the clipboard write is rejected', async () => {
    const deps = makeDeps({ webShare: undefined, copyToClipboard: vi.fn().mockRejectedValue(new Error('denied')) });
    await expect(shareWithFallback('hi', deps)).resolves.toBe('failed');
  });

  it('reports failure when nothing is available', async () => {
    const deps = makeDeps({ webShare: undefined, copyToClipboard: undefined });
    await expect(shareWithFallback('hi', deps)).resolves.toBe('failed');
  });
});
