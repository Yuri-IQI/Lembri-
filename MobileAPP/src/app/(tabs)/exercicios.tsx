import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio } from '@/types/exercicio';

/**
 * Tela principal de catálogo e acompanhamento dos exercícios cognitivos do Lembri.
 * Apresenta os cards temáticos do Figma com sequência de dias (streak) e registro interativo.
 */
const ExerciciosScreen = () => {
  const theme = useTheme();

  const { exercicios, registrarTentativa, resetarParaMocks } = useExerciciosStore(
    useShallow((state) => ({
      exercicios: state.exercicios,
      registrarTentativa: state.registrarTentativa,
      resetarParaMocks: state.resetarParaMocks,
    }))
  );

  const formatarNivel = (nivel: Exercicio['nivel']): string => {
    switch (nivel) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Médio';
      case 'dificil':
        return 'Difícil';
    }
  };

  const handlePraticar = (exercicio: Exercicio) => {
    // Registra uma tentativa simulada bem-sucedida para demonstrar reatividade no streak
    registrarTentativa(exercicio.id, 5, 5, 120);
  };

  const renderItem = ({ item }: { item: Exercicio }) => {
    return (
      <Card style={styles.cardExercicio}>
        <View style={styles.headerExercicio}>
          <ThemedText type="subheading">{item.titulo}</ThemedText>
          <View
            style={[
              styles.badgeStreak,
              { backgroundColor: theme.accent, borderColor: theme.border },
            ]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Sequência de ${item.streakDias} dias consecutivos`}>
            <ThemedText type="smallBold" style={{ color: theme.brand }}>
              🔥 {item.streakDias} {item.streakDias === 1 ? 'dia' : 'dias'}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          {item.descricao}
        </ThemedText>

        <View style={styles.metaRow}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Nível: {formatarNivel(item.nivel)}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            •
          </ThemedText>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Duração: ~{item.duracaoEstimadaMinutos} min
          </ThemedText>
        </View>

        <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Praticar exercício ${item.titulo}`}
          onPress={() => handlePraticar(item)}
          style={({ pressed }) => [
            styles.botaoPraticar,
            { backgroundColor: theme.primary },
            pressed && styles.botaoPressionado,
          ]}>
          <ThemedText type="smallBold" themeColor="onPrimary">
            Praticar Agora
          </ThemedText>
        </Pressable>
      </Card>
    );
  };

  return (
    <MainContainer>
      <ThemedText type="label">Estímulos Cognitivos Diários</ThemedText>

      <FlatList
        data={exercicios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          <Card style={styles.cardVazio}>
            <ThemedText type="subheading">Nenhum exercício carregado</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Restaure os exercícios de demonstração do Figma.
            </ThemedText>
            <Pressable
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Restaurar catálogo de exercícios padrão"
              onPress={resetarParaMocks}
              style={({ pressed }) => [
                styles.botaoRestaurar,
                { backgroundColor: theme.primary },
                pressed && styles.botaoPressionado,
              ]}>
              <ThemedText type="button" themeColor="onPrimary">
                Restaurar Exercícios
              </ThemedText>
            </Pressable>
          </Card>
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  listaConteudo: {
    gap: Spacing.two,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.five,
  },
  cardExercicio: {
    gap: Spacing.two,
  },
  headerExercicio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  botaoPraticar: {
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    marginTop: Spacing.one,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  cardVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  botaoRestaurar: {
    minHeight: TouchTarget,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
});

export default ExerciciosScreen;
