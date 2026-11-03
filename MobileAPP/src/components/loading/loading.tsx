import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Eclipse } from '@/components/loading/eclipse';
import { ThemedText } from '@/components/themed-text';
import { Colors, LoadingEclipse, Spacing } from '@/constants/theme';

export type LoadingProps = {
  /** Chamado quando a tela já foi desenhada; só então o splash nativo pode sair sem tela preta. */
  onDesenhada: () => void;
  /** Fontes, dados, tempo mínimo e tela de destino já estão prontos. */
  ready: boolean;
  /** Retira a camada somente depois do fade, ou imediatamente com movimento reduzido. */
  onFinished: () => void;
};

/** Tela de carregamento exibida ao abrir o app, enquanto os dados salvos são lidos. */
export const Loading = ({ onDesenhada, ready, onFinished }: LoadingProps) => {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!ready) return;
    let mounted = true;
    let completed = false;
    let animation: Animated.CompositeAnimation | undefined;
    const finish = () => {
      if (!mounted || completed) return;
      completed = true;
      onFinished();
    };
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduce) => {
      if (reduce) {
        animation?.stop();
        finish();
      }
    });
    AccessibilityInfo.isReduceMotionEnabled().catch(() => true).then((reduce) => {
      if (!mounted || completed) return;
      if (reduce) {
        finish();
        return;
      }
      animation = Animated.timing(opacity, {
        toValue: 0,
        duration: LoadingEclipse.fadeOutMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      });
      animation.start(({ finished }) => { if (finished) finish(); });
    });
    return () => {
      mounted = false;
      subscription.remove();
      animation?.stop();
    };
  }, [ready, opacity, onFinished]);

  return (
    <Animated.View
      testID="app-loading"
      style={[styles.tela, { opacity }]}
      accessibilityViewIsModal
      onLayout={onDesenhada}>
      <StatusBar barStyle="dark-content" />
      <Eclipse />
      <View style={styles.textos}>
        <ThemedText style={styles.marca}>LEMBRI!</ThemedText>
        <ThemedText
          themeColor="loadingTexto"
          style={styles.centro}
          accessibilityLiveRegion="polite">
          Carregando seus lembretes…
        </ThemedText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tela: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: LoadingEclipse.espacoConteudo,
    paddingHorizontal: Spacing.four,
    backgroundColor: Colors.loadingFundo,
  },
  textos: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  marca: {
    fontFamily: LoadingEclipse.fonteMarca,
    fontWeight: '500',
    fontSize: LoadingEclipse.tamanhoMarca,
    lineHeight: LoadingEclipse.alturaMarca,
    letterSpacing: LoadingEclipse.espacoMarca,
    color: Colors.loadingSombra,
  },
  centro: {
    textAlign: 'center',
  },
});
