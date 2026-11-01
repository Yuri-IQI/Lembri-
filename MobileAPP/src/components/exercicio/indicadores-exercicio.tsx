import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatarData } from '@/utils/data';
import type { EstatisticasExercicio } from '@/utils/exercicio';

export interface IndicadoresExercicioProps {
  estatisticas: EstatisticasExercicio;
}

/**
 * Painel de métricas e indicadores de desempenho do exercício (Figma exercicios_detalhe).
 *
 * Apresenta data da última atividade, tempo médio consumido e percentual médio de acertos,
 * exibindo traço '—' quando não houver tentativas registradas (cenário C5).
 */
export const IndicadoresExercicio = ({ estatisticas }: IndicadoresExercicioProps) => {
  const theme = useTheme();

  const dataFormatada = estatisticas.ultima
    ? formatarData(estatisticas.ultima.toISOString().split('T')[0])
    : '—';

  const tempoFormatado =
    estatisticas.tempoMedioMin !== undefined ? `${estatisticas.tempoMedioMin} min` : '—';

  const acertosFormatado =
    estatisticas.mediaAcertos !== undefined ? `${estatisticas.mediaAcertos}%` : '—';

  const labelAcessivel = estatisticas.ultima
    ? `Indicadores: Última atividade em ${dataFormatada}. Tempo médio de ${tempoFormatado}. Média de acertos de ${acertosFormatado}.`
    : 'Indicadores: Ainda não praticado. Sem registros de tempo ou acertos.';

  return (
    <Card
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={labelAcessivel}>
      <View style={styles.linha}>
        <View style={styles.coluna}>
          <ThemedText type="label" themeColor="textSecondary">
            ÚLTIMA ATIVIDADE
          </ThemedText>
          <ThemedText type="subheading">{dataFormatada}</ThemedText>
        </View>

        <View style={styles.metricas}>
          <View
            style={[
              styles.chip,
              { backgroundColor: theme.inputBackground, borderColor: theme.borderSubtle },
            ]}>
            <ThemedText type="label" themeColor="textSecondary">
              TEMPO MÉDIO
            </ThemedText>
            <ThemedText type="defaultBold">{tempoFormatado}</ThemedText>
          </View>

          <View
            style={[
              styles.chip,
              { backgroundColor: theme.inputBackground, borderColor: theme.borderSubtle },
            ]}>
            <ThemedText type="label" themeColor="textSecondary">
              ACERTOS
            </ThemedText>
            <ThemedText type="defaultBold">{acertosFormatado}</ThemedText>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
  },
  linha: {
    gap: Spacing.two,
  },
  coluna: {
    gap: Spacing.one,
  },
  metricas: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    flex: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
    alignItems: 'center',
    gap: Spacing.one,
  },
});
