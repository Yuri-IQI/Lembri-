import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { ExercicioCard } from '@/components/cards/exercicio-card';
import { GrupoExerciciosCard } from '@/components/cards/grupo-exercicios-card';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAgora } from '@/hooks/use-agora';
import { useComandosDeVoz } from '@/hooks/use-comandos-de-voz';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio } from '@/types/exercicio';
import {
  agruparExercicios,
  calcularStreak,
  descreverUltimaAtividade,
  historicoDoExercicio,
  ultimaTentativa,
} from '@/utils/exercicio';

/**
 * Tela principal de catálogo e acompanhamento dos exercícios cognitivos do Lembri (CARD-35 / frame exercicios_lista).
 *
 * Apresenta o catálogo "Treine sua memória" em cartões padronizados, com a sequência de dias de cada exercício e navegação direta para Começar ou Detalhes.
 */
const ExerciciosScreen = () => {
  const agora = useAgora();

  const { exercicios, historico, iniciarSessao, resetarParaMocks } = useExerciciosStore(
    useShallow((state) => ({
      exercicios: state.exercicios,
      historico: state.historico,
      iniciarSessao: state.iniciarSessao,
      resetarParaMocks: state.resetarParaMocks,
    }))
  );

  const itensDaLista = useMemo(() => agruparExercicios(exercicios), [exercicios]);

  const comandosVoz = useMemo(
    () =>
      exercicios.map((exercicio) => ({
        id: `exercicio-${exercicio.id}`,
        rotulo: exercicio.titulo,
        frases: exercicio.grupo ? [exercicio.titulo, exercicio.grupo] : [exercicio.titulo],
        executar: () => router.push(`/exercicio/${exercicio.id}`),
      })),
    [exercicios]
  );
  useComandosDeVoz(comandosVoz);

  const handleComecar = (exercicio: Exercicio) => {
    iniciarSessao(exercicio.id);
    router.push(`/exercicio/${exercicio.id}/memorizar`);
  };

  const handleDetalhes = (exercicio: Exercicio) => {
    router.push(`/exercicio/${exercicio.id}`);
  };

  const renderExercicio = (item: Exercicio) => {
    const tentativa = ultimaTentativa(historico, item.id);
    const ultimaAtividade = descreverUltimaAtividade(tentativa, agora);

    return (
      <ExercicioCard
        key={item.id}
        exercicio={item}
        ultimaAtividade={ultimaAtividade}
        diasSeguidos={calcularStreak(historicoDoExercicio(historico, item.id), agora)}
        onComecar={() => handleComecar(item)}
        onDetalhes={() => handleDetalhes(item)}
      />
    );
  };

  const renderItem = ({ item }: { item: Exercicio[] }) => {
    const [primeiro] = item;
    if (!primeiro.grupo) {
      return renderExercicio(primeiro);
    }

    return (
      <GrupoExerciciosCard
        titulo={primeiro.grupo}
        icone={primeiro.iconeGrupo ?? primeiro.icone}
        totalModos={item.length}>
        {item.map(renderExercicio)}
      </GrupoExerciciosCard>
    );
  };

  return (
    <MainContainer style={styles.container}>
      <View style={styles.cabecalho}>
        <ThemedText type="title" accessibilityRole="header">
          Treine sua memória
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Selecione um exercício
        </ThemedText>
      </View>

      <FlatList
        data={itensDaLista}
        keyExtractor={([primeiro]) => primeiro.grupo ?? primeiro.id}
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
              style={styles.botaoAcao}
            />
          </Card>
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.two,
  },
  cabecalho: {
    gap: Spacing.one,
  },
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
  botaoAcao: {
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
});

export default ExerciciosScreen;
