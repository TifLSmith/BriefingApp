import type { CapacitorConfig } from '@capacitor/cli';

const PRODUCTION_URL = 'https://apecbrief.lovable.app';

const config: CapacitorConfig = {
  appId: 'com.cyberthreatdailybriefing.app',
  appName: 'Cyber Threat Daily Briefing',
  webDir: 'dist/client',
  server: {
    url: PRODUCTION_URL,
    cleartext: false,
  },
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: '#0a0f0d', showSpinner: false },
    StatusBar: { style: 'DARK', backgroundColor: '#0a0f0d' },
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
  },
  ios: { contentInset: 'always', backgroundColor: '#0a0f0d' },
  android: { backgroundColor: '#0a0f0d' },
};

export default config;
