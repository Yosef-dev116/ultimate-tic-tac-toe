import { Capacitor } from '@capacitor/core';

/** True only inside the iOS/Android shell. Always false in a normal browser. */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}
