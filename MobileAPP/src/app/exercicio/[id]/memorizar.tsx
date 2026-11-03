import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { BarraAcoesExercicio } from '@/components/exercicio/barra-acoes-exercicio';
import { CartaoRodada } from '@/components/exercicio/cartao-rodada';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSessaoExercicio } from '@/hooks/use-sessao-exercicio';
import { useAvisoStore } from '@/stores/useAvisoStore';

/**
 * Fase de memorização prévia do exercício cognitivo (CARD-37 / frame exercicios_preview).
 *
 * Apresenta o cartão da rodada atual com os itens em estado neutro para fixação visual.
 * Sem cronômetro limitante (WCAG 2.2.3): a pessoa decide quando tocar em CONTINUAR.
 */
const MemorizarExercicioScreen = () => {
  const { sessaoValida, exercicio, rodadaAtual, indiceRodada, totalRodadas, pedirSaida, dialogoSaida } =
    useSessaoExercicio({ confirmarSaida: true });

  const aviso = useAvisoStore((state) => state.scope === 'exercise' ? state.mensagem : null);
  const fecharAviso = useAvisoStore((state) => state.fechar);

  if (!sessaoValida || !exercicio || !rodadaAtual) {
    return (
      <View style={styles.tela}>
        <TopBar onVoltar={() => router.replace('/exercicios')} />
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
    fecharAviso();
    router.replace(`/exercicio/${exercicio.id}/responder`);
  };

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={pedirSaida} saidaProtegida />

      <ScrollView style={styles.rolagem} contentContainerStyle={styles.conteudo}>
        {indiceRodada > 0 && aviso && <AvisoSucesso mensagem={aviso} onFechar={fecharAviso} />}

        <ThemedText type="label" themeColor="textSecondary" style={styles.progresso}>
          RODADA {indiceRodada + 1} DE {totalRodadas}
        </ThemedText>

        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            {exercicio.tituloMemorizacao}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Observe o cartão com atenção e memorize. Quando estiver pronto, toque em CONTINUAR.
          </ThemedText>
        </View>

        <CartaoRodada
          rotulo={rodadaAtual.rotulo}
          itens={rodadaAtual.itens}
          dicas={rodadaAtual.dicas}
          cor={rodadaAtual.cor}
          numerada={rodadaAtual.numerada}
          numeric={exercicio.modoResposta === 'teclado'}
          estadoPadrao="neutra"
        />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.rodape}>
        <BarraAcoesExercicio
          onContinuar={handleContinuar}
          continuarHabilitado={true}
        />
      </SafeAreaView>

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
  rolagem: {
    flex: 1,
  },
  rodape: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  progresso: {
    textAlign: 'center',
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

export default MemorizarExercicioScreen;
