import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yosefmekonnen.ultimatetictactoe',
  appName: 'Ultimate Tic-Tac-Toe',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#f7f6f3',
  },
  android: {
    backgroundColor: '#f7f6f3',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#7c3aed',
      showSpinner: false,
    },
  },
};

export default config;
