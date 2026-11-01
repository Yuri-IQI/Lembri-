import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { ExercicioCard } from '@/components/cards/exercicio-card';
import { CampoBusca } from '@/components/exercicio/campo-busca';
import { DestaqueStreak } from '@/components/exercicio/destaque-streak';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAgora } from '@/hooks/use-agora';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio } from '@/types/exercicio';
import {
  calcularStreak,
  descreverUltimaAtividade,
  filtrarExercicios,
  ultimaTentativa,
} from '@/utils/exercicio';

/**
 * Tela principal de catálogo e acompanhamento dos exercícios cognitivos do Lembri (CARD-35 / frame exercicios_lista).
 *
 * Apresenta o catálogo "Treine sua memória", busca reativa sem acentos, sequência de dias (streak geral)
 * e cartões padronizados com navegação direta para Começar ou Detalhes.
 */
const ExerciciosScreen = () => {
  const agora = useAgora();
  const [busca, setBusca] = useState('');

  const { exercicios, historico, iniciarSessao, resetarParaMocks } = useExerciciosStore(
    useShallow((state) => ({
      exercicios: state.exercicios,
      historico: state.historico,
      iniciarSessao: state.iniciarSessao,
      resetarParaMocks: state.resetarParaMocks,
    }))
  );

  const streakGeral = useMemo(() => calcularStreak(historico, agora), [historico, agora]);

  const exerciciosFiltrados = useMemo(
    () => filtrarExercicios(exercicios, busca),
    [exercicios, busca]
  );

  const handleComecar = (exercicio: Exercicio) => {
    iniciarSessao(exercicio.id);
    router.push(`/exercicio/${exercicio.id}/memorizar`);
  };

  const handleDetalhes = (exercicio: Exercicio) => {
    router.push(`/exercicio/${exercicio.id}`);
  };

  const renderItem = ({ item }: { item: Exercicio }) => {
    const tentativa = ultimaTentativa(historico, item.id);
    const ultimaAtividade = descreverUltimaAtividade(tentativa, agora);

    return (
      <ExercicioCard
        exercicio={item}
        ultimaAtividade={ultimaAtividade}
        onComecar={() => handleComecar(item)}
        onDetalhes={() => handleDetalhes(item)}
      />
    );
  };

  return (
    <MainContainer>
      <View style={styles.cabecalho}>
        <ThemedText type="title" accessibilityRole="header">
          Treine sua memória
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Selecione um exercício
        </ThemedText>
      </View>

      <DestaqueStreak dias={streakGeral} />

      <CampoBusca
        valor={busca}
        aoMudar={setBusca}
        aoLimpar={() => setBusca('')}
      />

      <FlatList
        data={exerciciosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          busca.length > 0 ? (
            <Card style={styles.cardVazio}>
              <ThemedText type="subheading">Nenhum exercício encontrado</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Não há resultados para &ldquo;{busca}&rdquo;.
              </ThemedText>
              <Botao
                rotulo="Limpar busca"
                variante="secundario"
                accessibilityLabel="Limpar termo de busca"
                onPress={() => setBusca('')}
                style={styles.botaoAcao}
              />
            </Card>
          ) : (
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
          )
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  cabecalho: {
    gap: Spacing.one,
    paddingTop: Spacing.one,
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
