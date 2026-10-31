import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Splash } from '@/components/splash';
import { useRespostasNotificacao } from '@/hooks/use-respostas-notificacao';
import { useSincronizarNotificacoes } from '@/hooks/use-sincronizar-notificacoes';
import { useStoresHidratadas } from '@/hooks/use-stores-hidratadas';
import { useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const hydrated = useStoresHidratadas();
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);
  useSincronizarNotificacoes(hydrated);
  useRespostasNotificacao(hydrated);

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
