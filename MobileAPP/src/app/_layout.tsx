import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Splash } from '@/components/splash';
import { SettingsPersistenceFeedback } from '@/components/ajustes/settings-persistence-feedback';
import { Colors } from '@/constants/theme';
import { useRespostasNotificacao } from '@/hooks/use-respostas-notificacao';
import { useSincronizarNotificacoes } from '@/hooks/use-sincronizar-notificacoes';
import { useStoresHidratadas } from '@/hooks/use-stores-hidratadas';
import { useSettingsPersistenceStore, useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

/** Mantém a navegação no tema claro definido em app.json e usado pelos componentes do Lembri. */
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

const RootLayout = () => {
  const hydrated = useStoresHidratadas();
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);
  const settingsError = useSettingsPersistenceStore((state) => state.error);
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
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <SettingsPersistenceFeedback />
      {!hasSeenSplash && !settingsError && <Splash onFim={markSplashSeen} />}
    </ThemeProvider>
  );
};

export default RootLayout;
