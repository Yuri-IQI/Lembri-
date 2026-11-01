import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { plural } from '@/utils/texto';

export interface DestaqueStreakProps {
  /** Quantidade de dias consecutivos apurados no streak geral. */
  dias: number;
}

/**
 * Card em destaque na listagem de exercícios apresentando a sequência de dias (streak geral).
 *
 * Exibe contagem com fogo quando houver dias acumulados ou mensagem incentivando o início
 * caso o histórico esteja zerado (cenário C4).
 */
export const DestaqueStreak = ({ dias }: DestaqueStreakProps) => {
  const theme = useTheme();

  const texto =
    dias > 0
      ? `🔥 ${dias} ${plural(dias, 'dia', 'dias')} seguidos`
      : 'Faça um exercício hoje para começar sua sequência';

  const rotuloAcessibilidade =
    dias > 0
      ? `Sequência de ${dias} ${plural(dias, 'dia', 'dias')} seguidos praticando exercícios`
      : 'Sequência zerada. Faça um exercício hoje para começar sua sequência';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.accentLight,
          borderColor: theme.borderSubtle,
        },
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={rotuloAcessibilidade}>
      <ThemedText
        type="defaultBold"
        style={[styles.texto, { color: theme.brand }]}>
        {texto}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    textAlign: 'center',
  },
});
