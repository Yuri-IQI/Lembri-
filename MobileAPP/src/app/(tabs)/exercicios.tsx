import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { ExercicioCard } from '@/components/cards/exercicio-card';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAgora } from '@/hooks/use-agora';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio } from '@/types/exercicio';
import { descreverUltimaAtividade, ultimaTentativa } from '@/utils/exercicio';

/**
 * Tela principal de catálogo e acompanhamento dos exercícios cognitivos do Lembri.
 * Apresenta os cards temáticos do Figma com sequência de dias (streak) e registro interativo.
 */
const ExerciciosScreen = () => {
  const agora = useAgora();

  const { exercicios, historico, registrarTentativa, resetarParaMocks } = useExerciciosStore(
    useShallow((state) => ({
      exercicios: state.exercicios,
      historico: state.historico,
      registrarTentativa: state.registrarTentativa,
      resetarParaMocks: state.resetarParaMocks,
    }))
  );

  const handleComecar = (exercicio: Exercicio) => {
    // Registra uma tentativa simulada bem-sucedida para demonstrar reatividade no streak
    registrarTentativa(exercicio.id, 5, 5, 120);
  };

  const handleDetalhes = () => {
    router.push({ pathname: '/em-breve', params: { titulo: 'Detalhes do exercício' } });
  };

  const renderItem = ({ item }: { item: Exercicio }) => {
    const tentativa = ultimaTentativa(historico, item.id);
    const ultimaAtividade = descreverUltimaAtividade(tentativa, agora);

    return (
      <ExercicioCard
        exercicio={item}
        ultimaAtividade={ultimaAtividade}
        onComecar={() => handleComecar(item)}
        onDetalhes={handleDetalhes}
      />
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
            <Botao
              rotulo="Restaurar Exercícios"
              variante="primario"
              accessibilityLabel="Restaurar catálogo de exercícios padrão"
              onPress={resetarParaMocks}
              style={styles.botaoRestaurar}
            />
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
  cardVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  botaoRestaurar: {
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
});

export default ExerciciosScreen;
