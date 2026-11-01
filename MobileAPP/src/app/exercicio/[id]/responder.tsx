import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { BarraAcoesExercicio } from '@/components/exercicio/barra-acoes-exercicio';
import { CasasResposta } from '@/components/exercicio/casas-resposta';
import { OpcoesResposta } from '@/components/exercicio/opcoes-resposta';
import { TecladoNumerico } from '@/components/exercicio/teclado-numerico';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSessaoExercicio } from '@/hooks/use-sessao-exercicio';
import { useAvisoStore } from '@/stores/useAvisoStore';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio, RodadaExercicio } from '@/types/exercicio';

const semAcao = () => {};

interface FormularioRodadaProps {
  exercicio: Exercicio;
  rodadaAtual: RodadaExercicio;
  indiceRodada: number;
  totalRodadas: number;
  respostasIniciais: string[];
  opcoesRodada: string[];
  pedirSaida: () => boolean;
  onConcluirRodada: (respostas: string[]) => void;
}

/**
 * Componente interno chaveado pela rodada (`key={indiceRodada}`) para inicialização
 * limpa e sem efeitos colaterais de estado no React 19 (elimina cascading renders).
 */
const FormularioRodada = ({
  exercicio,
  rodadaAtual,
  indiceRodada,
  totalRodadas,
  respostasIniciais,
  opcoesRodada,
  pedirSaida,
  onConcluirRodada,
}: FormularioRodadaProps) => {
  const theme = useTheme();
  const totalCasas = rodadaAtual.itens.length;
  const [respostas, setRespostas] = useState<string[]>(() => {
    if (respostasIniciais && respostasIniciais.length === totalCasas) {
      return respostasIniciais;
    }
    return Array(totalCasas).fill('');
  });

  const [casaAtiva, setCasaAtiva] = useState(() => {
    const primeiroVazio = respostas.findIndex((val) => val === '');
    return primeiroVazio !== -1 ? primeiroVazio : 0;
  });

  const [bufferDigitos, setBufferDigitos] = useState('');

  const tamanhoEsperadoDigitos = rodadaAtual.itens[0]?.length ?? 2;
  const todasPreenchidas = respostas.every((r) => r.trim().length > 0);

  // Manipulação no modo Teclado
  const handleDigitar = (digito: string) => {
    const novoBuffer = bufferDigitos + digito;
    if (novoBuffer.length === tamanhoEsperadoDigitos) {
      const novasRespostas = [...respostas];
      novasRespostas[casaAtiva] = novoBuffer;
      setRespostas(novasRespostas);
      setBufferDigitos('');

      // Avança o foco para a próxima casa vazia ou próxima posição
      const proximaVazia = novasRespostas.findIndex(
        (val, idx) => idx > casaAtiva && val === ''
      );
      if (proximaVazia !== -1) {
        setCasaAtiva(proximaVazia);
      } else if (casaAtiva + 1 < totalCasas) {
        setCasaAtiva(casaAtiva + 1);
      }
    } else {
      setBufferDigitos(novoBuffer);
    }
  };

  const handleApagar = () => {
    if (bufferDigitos.length > 0) {
      setBufferDigitos(bufferDigitos.slice(0, -1));
    } else if (respostas[casaAtiva] && respostas[casaAtiva].length > 0) {
      const novasRespostas = [...respostas];
      novasRespostas[casaAtiva] = '';
      setRespostas(novasRespostas);
      setBufferDigitos('');
    } else if (casaAtiva > 0) {
      setCasaAtiva(casaAtiva - 1);
    }
  };

  // Manipulação no modo Opções (chips)
  const handleSelecionarOpcao = (opcao: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[casaAtiva] = opcao;
    setRespostas(novasRespostas);

    // Avança para a próxima casa vazia se existir
    const proximaVazia = novasRespostas.findIndex((val) => val === '');
    if (proximaVazia !== -1) {
      setCasaAtiva(proximaVazia);
    }
  };

  const handleSelecionarCasa = (indice: number) => {
    // Tocar na casa ativa que já possui resposta limpa o campo (devolve o chip no modo opções)
    if (casaAtiva === indice && respostas[indice]) {
      const novasRespostas = [...respostas];
      novasRespostas[indice] = '';
      setRespostas(novasRespostas);
      setBufferDigitos('');
    } else {
      setCasaAtiva(indice);
      setBufferDigitos('');
    }
  };

  return (
    <>
      <View style={styles.progresso}>
        <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
          RODADA {indiceRodada + 1} DE {totalRodadas}
        </ThemedText>
      </View>

      <CasasResposta
        respostas={respostas}
        casaAtiva={casaAtiva}
        dicas={rodadaAtual.dicas}
        aoSelecionarCasa={handleSelecionarCasa}
      />

      <View style={[styles.divisor, { backgroundColor: theme.divider }]} />

      {exercicio.modoResposta === 'teclado' ? (
        <TecladoNumerico
          bufferDigitos={bufferDigitos}
          tamanhoEsperado={tamanhoEsperadoDigitos}
          aoDigitar={handleDigitar}
          aoApagar={handleApagar}
        />
      ) : (
        <OpcoesResposta
          opcoes={opcoesRodada}
          respostasAtuais={respostas}
          aoSelecionarOpcao={handleSelecionarOpcao}
        />
      )}

      <BarraAcoesExercicio
        onSair={pedirSaida}
        onContinuar={() => onConcluirRodada(respostas)}
        continuarHabilitado={todasPreenchidas}
        mensagemAviso={!todasPreenchidas ? 'Preencha todas as casas para continuar' : undefined}
      />
    </>
  );
};

/**
 * Tela de resposta interativa da rodada do exercício cognitivo (CARD-37 / frame exercicios_exec).
 *
 * Suporta modo teclado numérico (Sequências) e modo seleção de chips embaralhados (Ordenação,
 * Associações e Lista de compras), com navegação automática entre casas, revisão por toque e
 * confirmação com prevenção de avanço incompleto (RN-EX-08, RN-EX-09, RN-EX-10).
 */
const ResponderExercicioScreen = () => {
  const {
    sessao,
    exercicio,
    rodadaAtual,
    indiceRodada,
    totalRodadas,
    sessaoValida,
    pedirSaida,
    dialogoSaida,
  } = useSessaoExercicio({ confirmarSaida: true });

  const responderRodada = useExerciciosStore((state) => state.responderRodada);
  const avancarRodada = useExerciciosStore((state) => state.avancarRodada);
  const concluirSessao = useExerciciosStore((state) => state.concluirSessao);

  const aviso = useAvisoStore((state) => state.mensagem);
  const fecharAviso = useAvisoStore((state) => state.fechar);
  const mostrarAviso = useAvisoStore((state) => state.mostrar);

  const opcoesRodada = useMemo(() => {
    if (!sessao || !sessao.opcoes[indiceRodada]) return [];
    return sessao.opcoes[indiceRodada];
  }, [sessao, indiceRodada]);

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

  // Confirmação da rodada
  const handleConcluirRodada = (respostasFinais: string[]) => {
    const resultado = responderRodada(respostasFinais);
    if (!resultado) return;

    if (resultado.percentual === 100) {
      // Rodada toda correta
      mostrarAviso('Tudo certo!');
      AccessibilityInfo.announceForAccessibility('Tudo certo!');

      const temProxima = avancarRodada();
      if (temProxima) {
        // Próxima rodada
        router.replace(`/exercicio/${exercicio.id}/responder`);
      } else {
        // Conclui a sessão e abre o resumo
        concluirSessao();
        router.replace(`/exercicio/${exercicio.id}/resumo`);
      }
    } else {
      // Teve erro: direciona para tela de correção da rodada
      router.replace(`/exercicio/${exercicio.id}/correcao`);
    }
  };

  const respostasSalvas = sessao?.respostas[indiceRodada] ?? [];

  return (
    <View style={styles.tela}>
      <TopBar
        titulo="Exercícios"
        onVoltar={pedirSaida}
        onAjuda={semAcao}
        onAudio={semAcao}
      />

      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        {aviso && <AvisoSucesso mensagem={aviso} onFechar={fecharAviso} />}

        <FormularioRodada
          key={`${exercicio.id}-rodada-${indiceRodada}`}
          exercicio={exercicio}
          rodadaAtual={rodadaAtual}
          indiceRodada={indiceRodada}
          totalRodadas={totalRodadas}
          respostasIniciais={respostasSalvas}
          opcoesRodada={opcoesRodada}
          pedirSaida={pedirSaida}
          onConcluirRodada={handleConcluirRodada}
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
  progresso: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  divisor: {
    height: 1,
    marginVertical: Spacing.one,
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

export default ResponderExercicioScreen;
