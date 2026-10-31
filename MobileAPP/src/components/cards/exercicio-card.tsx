import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercicio } from '@/types/exercicio';
import { formatarNivel } from '@/utils/exercicio';

export type ExercicioCardProps = {
  exercicio: Exercicio;
  ultimaAtividade: string;
  onComecar: () => void;
  onDetalhes: () => void;
};

/**
 * Card padronizado de estímulo cognitivo do Lembri (CARD-24).
 *
 * Apresenta título, sequência em dias (streak), descrição, metadados de dificuldade/tempo,
 * histórico de última realização e dois botões de ação de 56dp (COMEÇAR e DETALHES).
 */
export const ExercicioCard = ({
  exercicio,
  ultimaAtividade,
  onComecar,
  onDetalhes,
}: ExercicioCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subheading" style={styles.titulo}>
          {exercicio.titulo}
        </ThemedText>
        <View
          style={[styles.badgeStreak, { backgroundColor: theme.accent, borderColor: theme.border }]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Sequência de ${exercicio.streakDias} dias consecutivos`}>
          <ThemedText type="smallBold" style={{ color: theme.brand }}>
            🔥 {exercicio.streakDias} {exercicio.streakDias === 1 ? 'dia' : 'dias'}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {exercicio.descricao}
      </ThemedText>

      <View style={styles.metaRow}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Nível: {formatarNivel(exercicio.nivel)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          •
        </ThemedText>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Duração: ~{exercicio.duracaoEstimadaMinutos} min
        </ThemedText>
      </View>

      <ThemedText type="smallBold" themeColor="textSecondary">
        {ultimaAtividade}
      </ThemedText>

      <View style={styles.botoes}>
        <Botao
          rotulo="COMEÇAR"
          variante="primario"
          onPress={onComecar}
          accessibilityLabel={`Começar exercício ${exercicio.titulo}`}
          style={styles.botao}
        />
        <Botao
          rotulo="DETALHES"
          variante="secundario"
          onPress={onDetalhes}
          accessibilityLabel={`Ver detalhes do exercício ${exercicio.titulo}`}
          style={styles.botao}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titulo: {
    flex: 1,
  },
  badgeStreak: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thin,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  botoes: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  botao: {
    flex: 1,
  },
});
