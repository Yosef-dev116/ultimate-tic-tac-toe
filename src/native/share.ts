import { Share } from '@capacitor/share';
import { isNativeApp } from './platform';

export type ShareOutcome = 'shared' | 'copied' | 'failed';

/** The browser and Capacitor calls, passed in so the fallback order can be unit tested. */
export interface ShareDeps {
  isNative: boolean;
  nativeShare: (text: string) => Promise<unknown>;
  webShare?: (text: string) => Promise<unknown>;
  copyToClipboard?: (text: string) => Promise<unknown>;
}

const SHARE_TITLE = 'Ultimate Tic-Tac-Toe';

/**
 * Share order: native share sheet in the app, then the Web Share API, then the clipboard.
 * A dismissed share sheet counts as handled ('shared'), so no fallback runs after it.
 */
export async function shareWithFallback(text: string, deps: ShareDeps): Promise<ShareOutcome> {
  const sheet = deps.isNative ? deps.nativeShare : deps.webShare;
  if (sheet) {
    try {
      await sheet(text);
    } catch {
      // The user dismissed the share sheet. Nothing to do.
    }
    return 'shared';
  }
  if (deps.copyToClipboard) {
    try {
      await deps.copyToClipboard(text);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
  return 'failed';
}

export function shareResultText(text: string): Promise<ShareOutcome> {
  return shareWithFallback(text, {
    isNative: isNativeApp(),
    nativeShare: (body) => Share.share({ title: SHARE_TITLE, text: body, dialogTitle: 'Share your result' }),
    webShare: navigator.share ? (body) => navigator.share({ title: SHARE_TITLE, text: body }) : undefined,
    copyToClipboard: navigator.clipboard ? (body) => navigator.clipboard.writeText(body) : undefined,
  });
}
