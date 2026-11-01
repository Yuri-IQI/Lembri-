import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercicio } from '@/types/exercicio';

export interface ExercicioCardProps {
  exercicio: Exercicio;
  ultimaAtividade: string;
  onComecar: () => void;
  onDetalhes: () => void;
}

/**
 * Card padronizado de estímulo cognitivo do Lembri (CARD-35 / frame exercicios_lista).
 *
 * Apresenta área de ícone de 64x64, título do exercício, descrição da última atividade
 * e botões de ação de 56dp (DETALHES secundário e COMEÇAR primário).
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
      <View style={styles.cabecalho}>
        <View
          style={[styles.areaIcone, { backgroundColor: theme.accentLight }]}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}>
          <SymbolView
            name={{ android: exercicio.icone }}
            size={32}
            tintColor={theme.text}
          />
        </View>

        <View style={styles.info}>
          <ThemedText type="subheading" style={styles.titulo}>
            {exercicio.titulo}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {ultimaAtividade}
          </ThemedText>
        </View>
      </View>

      <View style={styles.botoes}>
        <Botao
          rotulo="DETALHES"
          variante="secundario"
          onPress={onDetalhes}
          accessibilityLabel={`Ver detalhes do exercício ${exercicio.titulo}`}
          style={styles.botao}
        />
        <Botao
          rotulo="COMEÇAR"
          variante="primario"
          onPress={onComecar}
          accessibilityLabel={`Começar exercício ${exercicio.titulo}`}
          style={styles.botao}
        />
      </View>
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
  titulo: {
    fontSize: 22,
    lineHeight: 30,
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
