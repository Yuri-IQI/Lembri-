import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Splash } from '@/components/splash';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [abertura, setAbertura] = useState(true);
  const fecharAbertura = useCallback(() => setAbertura(false), []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      {abertura && <Splash onFim={fecharAbertura} />}
    </ThemeProvider>
  );
};

export default RootLayout;
