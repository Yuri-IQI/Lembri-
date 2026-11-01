import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { BarraAcoesExercicio } from '@/components/exercicio/barra-acoes-exercicio';
import { CartaoRodada } from '@/components/exercicio/cartao-rodada';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSessaoExercicio } from '@/hooks/use-sessao-exercicio';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { corrigirRodada } from '@/utils/exercicio';

const semAcao = () => {};

/**
 * Tela de correção imediata após erro na rodada (CARD-37 / frame exercicios_res_err).
 *
 * Apresenta a resposta correta da rodada para reforço da memorização e anuncia
 * o desempenho para leitores de tela (WCAG 4.1.3).
 */
const CorrecaoExercicioScreen = () => {
  const {
    sessao,
    exercicio,
    rodadaAtual,
    indiceRodada,
    sessaoValida,
    pedirSaida,
    dialogoSaida,
  } = useSessaoExercicio({ confirmarSaida: true });

  const avancarRodada = useExerciciosStore((state) => state.avancarRodada);
  const concluirSessao = useExerciciosStore((state) => state.concluirSessao);

  const resultado = useMemo(() => {
    if (!rodadaAtual || !sessao) return null;
    const respostasDadas = sessao.respostas[indiceRodada] ?? [];
    return corrigirRodada(rodadaAtual, respostasDadas);
  }, [rodadaAtual, sessao, indiceRodada]);

  useEffect(() => {
    if (resultado) {
      AccessibilityInfo.announceForAccessibility(
        `Você acertou ${resultado.acertos} de ${resultado.total}. Veja a resposta correta.`
      );
    }
  }, [resultado]);

  if (!sessaoValida || !exercicio || !rodadaAtual) {
    return (
      <View style={styles.tela}>
        <TopBar
          titulo="Exercícios"
          onVoltar={() => router.replace('/exercicios')}
          onAjuda={semAcao}
          onAudio={semAcao}
        />
        <View style={styles.conteudoVazio}>
          <ThemedText type="title">Este exercício não está em andamento</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Inicie um exercício a partir do catálogo para praticar.
          </ThemedText>
          <Botao
            rotulo="Ver exercícios"
            variante="primario"
            onPress={() => router.replace('/exercicios')}
            accessibilityLabel="Voltar para a lista de exercícios"
            style={styles.botaoVoltar}
          />
        </View>
      </View>
    );
  }

  const handleContinuar = () => {
    const temProxima = avancarRodada();
    if (temProxima) {
      router.replace(`/exercicio/${exercicio.id}/responder`);
    } else {
      concluirSessao();
      router.replace(`/exercicio/${exercicio.id}/resumo`);
    }
  };

  return (
    <View style={styles.tela}>
      <TopBar
        titulo="Exercícios"
        onVoltar={pedirSaida}
        onAjuda={semAcao}
        onAudio={semAcao}
      />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            Resposta Correta
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Veja como deveria ser a sequência correta desta rodada:
          </ThemedText>
        </View>

        <CartaoRodada
          rotulo={rodadaAtual.rotulo}
          itens={rodadaAtual.itens}
          dicas={rodadaAtual.dicas}
          estadoPadrao="neutra"
        />

        <BarraAcoesExercicio
          onSair={pedirSaida}
          onContinuar={handleContinuar}
          continuarHabilitado={true}
        />
      </ScrollView>

      <DialogoConfirmacao
        visivel={dialogoSaida.visivel}
        titulo="Sair do exercício"
        mensagem="Sair sem salvar esta tentativa?"
        rotuloCancelar="Cancelar"
        rotuloConfirmar="Sair"
        varianteConfirmar="perigo"
        onCancelar={dialogoSaida.onCancelar}
        onConfirmar={dialogoSaida.onConfirmar}
      />
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

export default CorrecaoExercicioScreen;
