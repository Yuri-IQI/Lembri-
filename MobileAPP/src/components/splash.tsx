import { useState } from 'react';
import { AccessibilityInfo, Animated, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { ComponentSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FADE = 400;

export type SplashProps = {
  /** Callback acionado após o fechamento da splash para notificar a conclusão. */
  onFim: () => void;
};

/**
 * Componente de tela de boas-vindas exibido na primeira abertura do aplicativo.
 *
 * Em total conformidade com WCAG 2.2 AAA:
 * - Não fecha por tempo (Critério 2.2.3: controle total pelo usuário).
 * - Botão de entrada com alvo mínimo de 56dp (Critério 2.5.5).
 * - Cabe na tela sem rolagem: o logo encolhe para dar espaço ao texto ampliado (Critério 1.4.8).
 * - Respeito à configuração de "Reduzir movimento" (Critério 2.3.3).
 * - Contêiner modal para focar leitores de tela exclusivamente na splash.
 */
export const Splash = ({ onFim }: SplashProps) => {
  const theme = useTheme();
  const [opacidade] = useState(() => new Animated.Value(1));
  const [saindo, setSaindo] = useState(false);

  const handleEntrar = async () => {
    if (saindo) return;
    setSaindo(true);

    try {
      const isReduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      if (isReduceMotion) {
        onFim();
        return;
      }
    } catch {
      // Em caso de falha na consulta de acessibilidade, segue com a animação padrão
    }

    Animated.timing(opacidade, {
      toValue: 0,
      duration: FADE,
      useNativeDriver: true,
    }).start(() => {
      onFim();
    });
  };

  return (
    <Animated.View
      accessibilityViewIsModal
      importantForAccessibility="yes"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.background, opacity: opacidade }]}>
      <SafeAreaView style={styles.conteudo}>
        <Image
          source={require('@/assets/splash/splash-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Lembri!"
        />
        <View style={styles.textos}>
          <ThemedText type="title">Bem-vindo ao Lembri!</ThemedText>
          <ThemedText themeColor="textSecondary">
            Organize seus lembretes e treine sua memória de uma forma simples.
          </ThemedText>
        </View>
        <View style={styles.acoes}>
          <Botao
            rotulo="Entrar"
            variante="primario"
            accessibilityLabel="Entrar no Lembri e abrir a tela inicial"
            onPress={handleEntrar}
          />
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
    paddingVertical: Spacing.four,
  },
  logo: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    maxHeight: ComponentSize.splashLogoMax,
  },
  textos: {
    gap: Spacing.two,
  },
  acoes: {
    marginTop: Spacing.two,
  },
});
