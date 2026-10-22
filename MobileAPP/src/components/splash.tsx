import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DURACAO = 2000;
const FADE = 400;

type SplashProps = {
  onFim: () => void;
};

export const Splash = ({ onFim }: SplashProps) => {
  const theme = useTheme();
  const [opacidade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacidade, { toValue: 0, duration: FADE, useNativeDriver: true }).start(onFim);
    }, DURACAO);
    return () => clearTimeout(timer);
  }, [opacidade, onFim]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.background, opacity: opacidade }]}
      onLayout={() => SplashScreen.hideAsync()}>
      <SafeAreaView style={styles.conteudo}>
        <Image
          source={require('@/assets/splash/splash-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Lembri!"
        />
        <View style={styles.textos}>
          <ThemedText type="title">Bem Vindo ao Lembri!</ThemedText>
          <ThemedText themeColor="textSecondary">
            Organize seus lembretes e treine sua memória de uma forma simples.
          </ThemedText>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  logo: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textos: {
    gap: Spacing.two,
  },
});
