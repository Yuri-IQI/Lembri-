import { Pressable, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { IconeExercicio } from '@/components/exercicio/icone-exercicio';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercicio } from '@/types/exercicio';
import { plural } from '@/utils/texto';

export interface ExercicioCardProps {
  exercicio: Exercicio;
  ultimaAtividade: string;
  /** Dias consecutivos praticando este exercício; 0 oculta a informação. */
  diasSeguidos: number;
  onComecar: () => void;
  onDetalhes: () => void;
}

/**
 * Card padronizado de estímulo cognitivo do Lembri (CARD-35 / frame exercicios_lista).
 *
 * Apresenta área de ícone de 64x64, título do exercício, descrição da última atividade,
 * sequência de dias e o botão COMEÇAR de 56dp. O cabeçalho abre os detalhes;
 * as duas ações são independentes, sem botões aninhados na web.
 */
export const ExercicioCard = ({
  exercicio,
  ultimaAtividade,
  diasSeguidos,
  onComecar,
  onDetalhes,
}: ExercicioCardProps) => {
  const theme = useTheme();
  const sequencia = plural(diasSeguidos, 'dia seguido', 'dias seguidos');

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={onDetalhes}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes do exercício ${exercicio.titulo}. ${ultimaAtividade}`}
        style={({ pressed }) => [styles.cabecalho, { opacity: pressed ? 0.7 : 1 }]}>
        <View
          style={[styles.areaIcone, { backgroundColor: theme.accentLight }]}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}>
          <IconeExercicio icone={exercicio.icone} />
        </View>

        <View style={styles.info}>
          <ThemedText type="subheading">
            {exercicio.titulo}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {ultimaAtividade}
          </ThemedText>
          {diasSeguidos > 0 && (
            <ThemedText type="small">{sequencia}</ThemedText>
          )}
        </View>
      </Pressable>

      {!exercicio.somenteRelogio && (
        <Botao
          rotulo="COMEÇAR"
          variante="primario"
          onPress={onComecar}
          accessibilityLabel={`Começar exercício ${exercicio.titulo}`}
          style={styles.botao}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  areaIcone: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  botao: {
    marginTop: Spacing.one,
  },
});
