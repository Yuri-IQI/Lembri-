import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { HistoricoTentativas } from '@/components/exercicio/historico-tentativas';
import { IndicadoresExercicio } from '@/components/exercicio/indicadores-exercicio';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { estatisticasDoExercicio, historicoDoExercicio } from '@/utils/exercicio';

const semAcao = () => {};

/**
 * Tela de detalhes e histórico do exercício cognitivo (CARD-36 / frame exercicios_detalhe).
 *
 * Apresenta o objetivo do exercício, indicadores médios de desempenho, parágrafos explicativos
 * de instruções, histórico persistido de tentativas e botão fixo para iniciar a prática.
 */
const ExercicioDetalheScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const exercicios = useExerciciosStore((state) => state.exercicios);
  const historico = useExerciciosStore((state) => state.historico);
  const iniciarSessao = useExerciciosStore((state) => state.iniciarSessao);

  const exercicio = useMemo(
    () => exercicios.find((item) => item.id === id),
    [exercicios, id]
  );

  const estatisticas = useMemo(
    () => (exercicio ? estatisticasDoExercicio(historico, exercicio.id) : null),
    [historico, exercicio]
  );

  const tentativas = useMemo(
    () => (exercicio ? historicoDoExercicio(historico, exercicio.id) : []),
    [historico, exercicio]
  );

  if (!exercicio || !estatisticas) {
    return (
      <View style={styles.tela}>
        <TopBar titulo="Exercícios" onVoltar={() => router.back()} onAjuda={semAcao} onAudio={semAcao} />
        <View style={styles.conteudoVazio}>
          <ThemedText type="title">Exercício não encontrado</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            O exercício solicitado não está disponível no catálogo.
          </ThemedText>
          <Botao
            rotulo="Voltar aos exercícios"
            variante="primario"
            onPress={() => router.back()}
            accessibilityLabel="Voltar para a lista de exercícios"
            style={styles.botaoVoltar}
          />
        </View>
      </View>
    );
  }

  const handleComecar = () => {
    iniciarSessao(exercicio.id);
    router.push(`/exercicio/${exercicio.id}/memorizar`);
  };

  return (
    <View style={styles.tela}>
      <TopBar
        titulo="Exercícios"
        onVoltar={() => router.back()}
        onAjuda={semAcao}
        onAudio={semAcao}
      />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            {exercicio.titulo}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            {exercicio.descricao}
          </ThemedText>
        </View>

        <IndicadoresExercicio estatisticas={estatisticas} />

        <Card style={styles.cardInstrucoes}>
          <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
            INSTRUÇÕES
          </ThemedText>
          <View style={styles.paragrafos}>
            {exercicio.instrucoes.map((paragrafo, index) => (
              <ThemedText key={`instrucao-${index}`} type="default" style={styles.textoInstrucao}>
                {paragrafo}
              </ThemedText>
            ))}
          </View>
        </Card>

        <HistoricoTentativas tentativas={tentativas} />
      </ScrollView>

      <View style={styles.rodapeFixo}>
        <Botao
          rotulo="COMEÇAR"
          variante="primario"
          onPress={handleComecar}
          accessibilityLabel={`Começar exercício ${exercicio.titulo}`}
          style={styles.botaoComecar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: 96,
    gap: Spacing.three,
  },
  cabecalho: {
    gap: Spacing.one,
  },
  cardInstrucoes: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  paragrafos: {
    gap: Spacing.two,
  },
  textoInstrucao: {
    lineHeight: 28,
  },
  rodapeFixo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: 'transparent',
  },
  botaoComecar: {
    width: '100%',
  },
  conteudoVazio: {
    flex: 1,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  botaoVoltar: {
    alignSelf: 'stretch',
  },
});

export default ExercicioDetalheScreen;
