import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { CartaoRodada } from '@/components/exercicio/cartao-rodada';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSessaoExercicio } from '@/hooks/use-sessao-exercicio';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { formatarDuracao, resultadoDaSessao } from '@/utils/exercicio';

const semAcao = () => {};

/**
 * Tela de resumo e consolidação do desempenho no exercício cognitivo (CARD-38 / frame exercicios_review).
 *
 * Apresenta o tempo gasto, detalhamento por rodada com status visual por casa (✓/✗),
 * pontuação final consolidada e opções para REFAZER ou voltar aos exercícios.
 */
const ResumoExercicioScreen = () => {
  const { sessao, exercicio, sessaoValida } = useSessaoExercicio({
    confirmarSaida: false,
  });

  const historico = useExerciciosStore((state) => state.historico);
  const iniciarSessao = useExerciciosStore((state) => state.iniciarSessao);

  const tentativaSalva = useMemo(() => {
    if (!sessao?.tentativaId) return null;
    return historico.find((item) => item.id === sessao.tentativaId) ?? null;
  }, [sessao, historico]);

  const resultado = useMemo(() => {
    if (!exercicio || !sessao) return null;
    return resultadoDaSessao(exercicio, sessao);
  }, [exercicio, sessao]);

  const tempoGasto = tentativaSalva ? tentativaSalva.tempoGastoSegundos : 60;
  const duracaoTexto = formatarDuracao(tempoGasto);

  useEffect(() => {
    if (resultado) {
      AccessibilityInfo.announceForAccessibility(
        `Você acertou ${resultado.acertos} de ${resultado.total} em ${duracaoTexto}.`
      );
    }
  }, [resultado, duracaoTexto]);

  if (!sessaoValida || !exercicio || !resultado) {
    return (
      <View style={styles.tela}>
        <TopBar
          titulo="Exercícios"
          onVoltar={() => router.replace('/exercicios')}
          onAjuda={semAcao}
          onAudio={semAcao}
        />
        <View style={styles.conteudoVazio}>
          <ThemedText type="title">Nenhum resumo disponível</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Não há uma tentativa concluída recentemente para visualização.
          </ThemedText>
          <Botao
            rotulo="Voltar aos exercícios"
            variante="primario"
            onPress={() => router.replace('/exercicios')}
            accessibilityLabel="Voltar para a lista de exercícios"
            style={styles.botaoAcao}
          />
        </View>
      </View>
    );
  }

  const handleRefazer = () => {
    iniciarSessao(exercicio.id);
    router.replace(`/exercicio/${exercicio.id}/memorizar`);
  };

  const handleVoltarExercicios = () => {
    router.replace('/exercicios');
  };

  return (
    <View style={styles.tela}>
      <TopBar
        titulo="Exercícios"
        onVoltar={handleVoltarExercicios}
        onAjuda={semAcao}
        onAudio={semAcao}
      />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            Resumo
          </ThemedText>
          <ThemedText type="defaultBold" style={styles.tempoGasto}>
            Tempo Gasto:{' '}
            <ThemedText type="defaultBold" themeColor="textSecondary">
              {duracaoTexto}
            </ThemedText>
          </ThemedText>
        </View>

        <View style={styles.rodadas}>
          {exercicio.rodadas.map((rodada, index) => (
            <CartaoRodada
              key={rodada.id}
              rotulo={rodada.rotulo}
              itens={rodada.itens}
              dicas={rodada.dicas}
              resultado={resultado.rodadas[index]}
              mostrarPercentual={true}
            />
          ))}
        </View>

        <Card style={styles.cardPontuacao}>
          <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
            PONTUAÇÃO TOTAL
          </ThemedText>
          <ThemedText
            type="display"
            style={styles.textoTotal}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${resultado.acertos} acertos de ${resultado.total} itens`}>
            {resultado.acertos}/{resultado.total}
          </ThemedText>
        </Card>

        <View style={styles.botoes}>
          <Botao
            rotulo="REFAZER"
            variante="primario"
            onPress={handleRefazer}
            accessibilityLabel={`Refazer exercício ${exercicio.titulo}`}
            style={styles.botaoAcao}
          />
          <Botao
            rotulo="VOLTAR AOS EXERCÍCIOS"
            variante="secundario"
            onPress={handleVoltarExercicios}
            accessibilityLabel="Voltar para a lista de exercícios"
            style={styles.botaoAcao}
          />
        </View>
      </ScrollView>
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
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  cabecalho: {
    gap: Spacing.one,
  },
  tempoGasto: {
    fontSize: 20,
    lineHeight: 28,
  },
  rodadas: {
    gap: Spacing.three,
  },
  cardPontuacao: {
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  textoTotal: {
    fontSize: 56,
    lineHeight: 64,
    textAlign: 'center',
  },
  botoes: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  botaoAcao: {
    width: '100%',
  },
  conteudoVazio: {
    flex: 1,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
});

export default ResumoExercicioScreen;
