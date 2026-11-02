import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, useColorScheme } from 'react-native';

import { Loading } from '@/components/loading/loading';
import { Splash } from '@/components/splash';
import { DialogoVoz } from '@/components/voz/dialogo-voz';
import { LoadingEclipse } from '@/constants/theme';
import { useRespostasNotificacao } from '@/hooks/sincronizacao/use-respostas-notificacao';
import { useSincronizarNotificacoes } from '@/hooks/sincronizacao/use-sincronizar-notificacoes';
import { useSincronizarRelogio } from '@/hooks/sincronizacao/use-sincronizar-relogio';
import { useStoresHidratadas } from '@/hooks/use-stores-hidratadas';
import { useTempoMinimo } from '@/hooks/tempo/use-tempo-minimo';
import { useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const hydrated = useStoresHidratadas();
  const tempoMinimoPassou = useTempoMinimo(LoadingEclipse.tempoMinimoMs);
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);
  useSincronizarNotificacoes(hydrated);
  useRespostasNotificacao(hydrated);
  useSincronizarRelogio(hydrated);

  return (
    <>
      {hydrated && (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
          <Stack screenOptions={{ headerShown: false }} />
          <DialogoVoz />
          {!hasSeenSplash && <Splash onFim={markSplashSeen} />}
        </ThemeProvider>
      )}
      {(!hydrated || !tempoMinimoPassou) && <Loading onDesenhada={SplashScreen.hideAsync} />}
    </>
  );
};

export default RootLayout;
