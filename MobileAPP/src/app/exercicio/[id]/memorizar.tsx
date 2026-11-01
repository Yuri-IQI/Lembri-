import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { BarraAcoesExercicio } from '@/components/exercicio/barra-acoes-exercicio';
import { CartaoRodada } from '@/components/exercicio/cartao-rodada';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSessaoExercicio } from '@/hooks/use-sessao-exercicio';

const semAcao = () => {};

/**
 * Fase de memorização prévia do exercício cognitivo (CARD-37 / frame exercicios_preview).
 *
 * Apresenta todos os cartões de rodadas com os itens em estado neutro para fixação visual.
 * Sem cronômetro limitante (WCAG 2.2.3): a pessoa decide quando tocar em CONTINUAR.
 */
const MemorizarExercicioScreen = () => {
  const { sessaoValida, exercicio, pedirSaida, dialogoSaida } = useSessaoExercicio({
    confirmarSaida: true,
  });

  if (!sessaoValida || !exercicio) {
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
    router.replace(`/exercicio/${exercicio.id}/responder`);
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
            {exercicio.tituloMemorizacao}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Observe os cartões com atenção e memorize a sequência. Quando estiver pronto, toque em CONTINUAR.
          </ThemedText>
        </View>

        <View style={styles.rodadas}>
          {exercicio.rodadas.map((rodada) => (
            <CartaoRodada
              key={rodada.id}
              rotulo={rodada.rotulo}
              itens={rodada.itens}
              dicas={rodada.dicas}
              estadoPadrao="neutra"
            />
          ))}
        </View>

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
  rodadas: {
    gap: Spacing.three,
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
