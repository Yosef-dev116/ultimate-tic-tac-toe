import { SplashScreen } from '@capacitor/splash-screen';
import { isNativeApp } from './platform';

/** One-time native setup. Does nothing in a browser. */
export function initNativeApp(): void {
  if (!isNativeApp()) return;
  document.documentElement.classList.add('is-native');
  // The splash stays up until React has painted, then fades out.
  requestAnimationFrame(() => {
    SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {});
  });
}
