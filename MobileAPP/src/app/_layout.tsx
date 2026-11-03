import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts, type FontFamilyDefinition } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, StatusBar } from 'react-native';

import { DialogoVoz } from '@/components/voz/dialogo-voz';

import { Loading } from '@/components/loading/loading';
import { Splash } from '@/components/splash';
import { SettingsPersistenceFeedback } from '@/components/ajustes/settings-persistence-feedback';
import { Colors, FontFamily, LoadingEclipse } from '@/constants/theme';
import { useRespostasNotificacao } from '@/hooks/use-respostas-notificacao';
import { useSincronizarNotificacoes } from '@/hooks/use-sincronizar-notificacoes';
import { useSincronizarRelogio } from '@/hooks/use-sincronizar-relogio';
import { useStoresHidratadas } from '@/hooks/use-stores-hidratadas';
import { useTempoMinimo } from '@/hooks/use-tempo-minimo';
import { useSettingsPersistenceStore, useSettingsStore } from '@/stores/useSettingsStore';

SplashScreen.preventAutoHideAsync();

/** O config plugin incorpora as fontes no Android; a web carrega as mesmas famílias em runtime. */
const webFonts: FontFamilyDefinition[] = Platform.OS === 'web' ? [
  {
    fontFamily: FontFamily,
    fontDefinitions: [
      { path: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'), weight: 400 },
      { path: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'), weight: 500 },
      { path: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'), weight: 600 },
      { path: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'), weight: 700 },
      { path: require('@expo-google-fonts/inter/900Black/Inter_900Black.ttf'), weight: 900 },
    ],
  },
  {
    fontFamily: LoadingEclipse.fonteMarca,
    fontDefinitions: [
      { path: require('@expo-google-fonts/eb-garamond/500Medium/EBGaramond_500Medium.ttf'), weight: 500 },
    ],
  },
] : [];

/** Mantém a navegação no tema claro definido em app.json e usado pelos componentes do Lembri. */
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

const RootLayout = () => {
  const hydrated = useStoresHidratadas();
  const [fontsLoaded, fontError] = useFonts(webFonts);
  const ready = hydrated && (fontsLoaded || Boolean(fontError));
  const tempoMinimoPassou = useTempoMinimo(LoadingEclipse.tempoMinimoMs);
  const hasSeenSplash = useSettingsStore((s) => s.hasSeenSplash);
  const markSplashSeen = useSettingsStore((s) => s.markSplashSeen);
  const settingsError = useSettingsPersistenceStore((state) => state.error);
  useSincronizarNotificacoes(hydrated);
  useRespostasNotificacao(hydrated);
  useSincronizarRelogio(hydrated);

  return (
    <>
      {ready && (
        <ThemeProvider value={navigationTheme}>
          <StatusBar barStyle="dark-content" />
          <Stack screenOptions={{ headerShown: false }} />
          <SettingsPersistenceFeedback />
          <DialogoVoz />
          {!hasSeenSplash && !settingsError && <Splash onFim={markSplashSeen} />}
        </ThemeProvider>
      )}
      {(!ready || !tempoMinimoPassou) && <Loading onDesenhada={SplashScreen.hideAsync} />}
    </>
  );
};

export default RootLayout;
