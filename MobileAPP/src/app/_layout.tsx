import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Splash } from '@/components/splash';
import { useSettingsHydrated } from '@/hooks/use-settings-hydrated';
import { useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const hydrated = useSettingsHydrated();
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync();
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      {!hasSeenSplash && <Splash onFim={markSplashSeen} />}
    </ThemeProvider>
  );
};

export default RootLayout;
