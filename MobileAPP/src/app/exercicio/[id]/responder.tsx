import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { AccessibilityInfo, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/feedback/aviso-sucesso';
import { Botao } from '@/components/controles/botao';
import { DialogoConfirmacao } from '@/components/feedback/dialogo-confirmacao';
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
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { Exercicio, RodadaExercicio } from '@/types/exercicio';
import { avaliarCasa } from '@/utils/exercicio/exercicio';

interface FormularioRodadaProps {
  exercicio: Exercicio;
  rodadaAtual: RodadaExercicio;
  indiceRodada: number;
  totalRodadas: number;
  respostasIniciais: string[];
  opcoesRodada: string[];
  onConcluirRodada: (respostas: string[]) => void;
  onSeguirSemCorrigir: () => void;
}

const FormularioRodada = ({
  exercicio,
  rodadaAtual,
  indiceRodada,
  totalRodadas,
  respostasIniciais,
  opcoesRodada,
  onConcluirRodada,
  onSeguirSemCorrigir,
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
  const [conferidas, setConferidas] = useState<string[] | null>(null);
  const modoTeclado = exercicio.modoResposta === 'teclado';
  const comDicas = useSettingsStore((state) => state.showExerciseHints);
  const avaliacoes = conferidas
    ? respostas.map((valor, i) =>
        valor && valor === conferidas[i] ? avaliarCasa(valor, i, rodadaAtual.itens, comDicas) : null
      )
    : undefined;

  const handleContinuar = () => {
    if (conferidas?.every((valor, i) => valor === respostas[i])) {
      onSeguirSemCorrigir();
      return;
    }
    onConcluirRodada(respostas);
    setConferidas(respostas);
  };

  const tamanhoEsperadoDigitos = rodadaAtual.itens[0]?.length ?? 2;
  const todasPreenchidas = respostas.every((r) => r.trim().length > 0);

  const handleDigitar = (digito: string) => {
    const novoBuffer = bufferDigitos + digito;
    if (novoBuffer.length === tamanhoEsperadoDigitos) {
      const novasRespostas = [...respostas];
      novasRespostas[casaAtiva] = novoBuffer;
      setRespostas(novasRespostas);
      setBufferDigitos('');

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

  const handleSelecionarOpcao = (opcao: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[casaAtiva] = opcao;
    setRespostas(novasRespostas);

    const proximaVazia = novasRespostas.findIndex((val) => val === '');
    if (proximaVazia !== -1) {
      setCasaAtiva(proximaVazia);
    }
  };

  const handleSelecionarCasa = (indice: number) => {
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
      <ScrollView
        style={styles.rolagem}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <View style={styles.progresso}>
          <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
            RODADA {indiceRodada + 1} DE {totalRodadas}
          </ThemedText>
        </View>

        <CasasResposta
          respostas={respostas}
          casaAtiva={casaAtiva}
          dicas={rodadaAtual.dicas}
          rascunho={bufferDigitos}
          avaliacoes={avaliacoes}
          colunas={modoTeclado ? totalCasas : rodadaAtual.numerada ? 1 : 2}
          cor={rodadaAtual.cor}
          numerada={rodadaAtual.numerada}
          aoSelecionarCasa={handleSelecionarCasa}
        />

        {conferidas && (
          <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
            {comDicas &&
              `Amarelo: ${modoTeclado ? 'número' : rodadaAtual.numerada ? 'passo' : 'palavra'} de outra posição. `}
            Corrija e toque em CONTINUAR, ou toque de novo para seguir.
          </ThemedText>
        )}

        <View style={[styles.divisor, { backgroundColor: theme.divider }]} />

        {modoTeclado ? (
          <TecladoNumerico
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

      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.rodape}>
        <BarraAcoesExercicio
          onContinuar={handleContinuar}
          continuarHabilitado={todasPreenchidas}
          mensagemAviso={!todasPreenchidas ? 'Preencha todas as casas para continuar' : undefined}
        />
      </SafeAreaView>
    </>
  );
};

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

  const irParaProximaRodada = () => {
    if (avancarRodada()) {
      router.replace(`/exercicio/${exercicio.id}/memorizar`);
    } else {
      concluirSessao();
      router.replace(`/exercicio/${exercicio.id}/resumo`);
    }
  };

  const handleConcluirRodada = (respostasFinais: string[]) => {
    const resultado = responderRodada(respostasFinais);
    if (!resultado) return;

    void Haptics.notificationAsync(
      resultado.percentual === 100
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );

    if (resultado.percentual === 100) {
      mostrarAviso('Tudo certo!');
      AccessibilityInfo.announceForAccessibility('Tudo certo!');

      irParaProximaRodada();
    }
  };

  const respostasSalvas = sessao?.respostas[indiceRodada] ?? [];

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={pedirSaida} saidaProtegida />

      {aviso && (
        <View style={styles.aviso}>
          <AvisoSucesso mensagem={aviso} onFechar={fecharAviso} />
        </View>
      )}

      <FormularioRodada
        key={`${exercicio.id}-rodada-${indiceRodada}`}
        exercicio={exercicio}
        rodadaAtual={rodadaAtual}
        indiceRodada={indiceRodada}
        totalRodadas={totalRodadas}
        respostasIniciais={respostasSalvas}
        opcoesRodada={opcoesRodada}
        onConcluirRodada={handleConcluirRodada}
        onSeguirSemCorrigir={irParaProximaRodada}
      />

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
  aviso: {
    paddingHorizontal: Spacing.four,
  },
  rodape: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
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
