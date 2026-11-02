import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';

import { DialogoVoz } from '@/components/voz/dialogo-voz';

import { Loading } from '@/components/loading/loading';
import { Splash } from '@/components/splash';
import { SettingsPersistenceFeedback } from '@/components/ajustes/settings-persistence-feedback';
import { Colors, LoadingEclipse } from '@/constants/theme';
import { useRespostasNotificacao } from '@/hooks/use-respostas-notificacao';
import { useSincronizarNotificacoes } from '@/hooks/use-sincronizar-notificacoes';
import { useSincronizarRelogio } from '@/hooks/use-sincronizar-relogio';
import { useStoresHidratadas } from '@/hooks/use-stores-hidratadas';
import { useTempoMinimo } from '@/hooks/use-tempo-minimo';
import { useSettingsPersistenceStore, useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

/** Mantém a navegação no tema claro definido em app.json e usado pelos componentes do Lembri. */
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

const RootLayout = () => {
  const hydrated = useStoresHidratadas();
  const tempoMinimoPassou = useTempoMinimo(LoadingEclipse.tempoMinimoMs);
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);
  const settingsError = useSettingsPersistenceStore((state) => state.error);
  useSincronizarNotificacoes(hydrated);
  useRespostasNotificacao(hydrated);
  useSincronizarRelogio(hydrated);

  return (
    <>
      {hydrated && (
        <ThemeProvider value={navigationTheme}>
          <StatusBar barStyle="dark-content" />
          <Stack screenOptions={{ headerShown: false }} />
          <SettingsPersistenceFeedback />
          <DialogoVoz />
          {!hasSeenSplash && !settingsError && <Splash onFim={markSplashSeen} />}
        </ThemeProvider>
      )}
      {(!hydrated || !tempoMinimoPassou) && <Loading onDesenhada={SplashScreen.hideAsync} />}
    </>
  );
};

export default RootLayout;
