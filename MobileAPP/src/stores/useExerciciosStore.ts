import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { exerciciosIniciaisMock } from '@/mocks/exercicios.mock';
import { historicoIniciaisMock } from '@/mocks/historico-tentativas.mock';
import type {
  Exercicio,
  ResultadoRodada,
  SessaoExercicio,
  TentativaExercicio,
} from '@/types/exercicio';
import { corrigirRodada, embaralhar, resultadoDaSessao } from '@/utils/exercicio';

/**
 * Interface que define o estado e as ações da store de exercícios cognitivos.
 */
export interface ExerciciosState {
  /** Catálogo de exercícios disponíveis. */
  exercicios: Exercicio[];
  /** Histórico persistido de execuções e resultados de exercícios, mais recentes primeiro. */
  historico: TentativaExercicio[];
  /** Sessão de execução em andamento (mantida somente em memória). */
  sessao: SessaoExercicio | null;

  // Ações
  /** Abre uma nova sessão de execução para o exercício informado e sorteia as opções. */
  iniciarSessao: (exercicioId: string) => void;
  /** Grava as respostas fornecidas para a rodada atual e retorna a avaliação. */
  responderRodada: (respostas: string[]) => ResultadoRodada | null;
  /** Avança para a próxima rodada da sessão; retorna falso quando for a última rodada. */
  avancarRodada: () => boolean;
  /** Consolida a sessão, calcula o resultado e persiste a tentativa uma única vez (idempotente). */
  concluirSessao: () => TentativaExercicio | null;
  /** Descarta a sessão em andamento sem persistir nenhuma tentativa no histórico. */
  descartarSessao: () => void;
  /** Restaura o catálogo e o histórico de exercícios para os dados mockados padrão. */
  resetarParaMocks: () => void;
}

/**
 * Store global Zustand para controle de exercícios cognitivos e progresso do usuário.
 */
export const useExerciciosStore = create<ExerciciosState>()(
  persist(
    (set, get) => ({
      exercicios: exerciciosIniciaisMock,
      historico: historicoIniciaisMock,
      sessao: null,

      iniciarSessao: (exercicioId: string) => {
        const exercicio = get().exercicios.find((item) => item.id === exercicioId);
        if (!exercicio) {
          return;
        }

        const respostas: string[][] = exercicio.rodadas.map((rodada) =>
          Array(rodada.itens.length).fill('')
        );

        const opcoes: string[][] = exercicio.rodadas.map((rodada) => {
          if (exercicio.modoResposta === 'opcoes') {
            const todosItens = [...rodada.itens, ...(rodada.distratores ?? [])];
            return embaralhar(todosItens);
          }
          return [];
        });

        const novaSessao: SessaoExercicio = {
          exercicioId,
          inicio: new Date().toISOString(),
          rodadaAtual: 0,
          respostas,
          opcoes,
          tentativaId: null,
        };

        set({ sessao: novaSessao });
      },

      responderRodada: (respostas: string[]) => {
        const { sessao, exercicios } = get();
        if (!sessao) {
          return null;
        }

        const exercicio = exercicios.find((item) => item.id === sessao.exercicioId);
        if (!exercicio) {
          return null;
        }

        const rodada = exercicio.rodadas[sessao.rodadaAtual];
        if (!rodada) {
          return null;
        }

        const novasRespostas = sessao.respostas.map((r, i) =>
          i === sessao.rodadaAtual ? [...respostas] : r
        );

        set({
          sessao: {
            ...sessao,
            respostas: novasRespostas,
          },
        });

        return corrigirRodada(rodada, respostas);
      },

      avancarRodada: () => {
        const { sessao, exercicios } = get();
        if (!sessao) {
          return false;
        }

        const exercicio = exercicios.find((item) => item.id === sessao.exercicioId);
        if (!exercicio) {
          return false;
        }

        if (sessao.rodadaAtual + 1 < exercicio.rodadas.length) {
          set({
            sessao: {
              ...sessao,
              rodadaAtual: sessao.rodadaAtual + 1,
            },
          });
          return true;
        }

        return false;
      },

      concluirSessao: () => {
        const { sessao, exercicios, historico } = get();
        if (!sessao) {
          return null;
        }

        // Idempotência: se a tentativa já foi gravada nesta sessão, retorna o registro existente
        if (sessao.tentativaId) {
          return historico.find((item) => item.id === sessao.tentativaId) ?? null;
        }

        const exercicio = exercicios.find((item) => item.id === sessao.exercicioId);
        if (!exercicio) {
          return null;
        }

        const { acertos, total, percentual } = resultadoDaSessao(exercicio, sessao);
        const agoraMs = Date.now();
        const inicioMs = new Date(sessao.inicio).getTime();
        const tempoGastoSegundos = Math.max(1, Math.round((agoraMs - inicioMs) / 1000));

        const tentativaId = `tentativa-${agoraMs}`;
        const novaTentativa: TentativaExercicio = {
          id: tentativaId,
          exercicioId: sessao.exercicioId,
          dataHora: new Date().toISOString(),
          tempoGastoSegundos,
          acertos,
          totalQuestoes: total,
          pontuacaoPercentual: percentual,
        };

        set({
          historico: [novaTentativa, ...historico],
          sessao: {
            ...sessao,
            tentativaId,
          },
        });

        return novaTentativa;
      },

      descartarSessao: () => {
        set({ sessao: null });
      },

      resetarParaMocks: () => {
        set({
          exercicios: exerciciosIniciaisMock,
          historico: historicoIniciaisMock,
          sessao: null,
        });
      },
    }),
    {
      name: 'lembri-exercicios',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        historico: state.historico,
      }),
    }
  )
);
