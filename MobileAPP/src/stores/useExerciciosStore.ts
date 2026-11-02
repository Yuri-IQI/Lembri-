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
import { corrigirRodada, embaralhar, resultadoDaSessao } from '@/utils/exercicio/exercicio';
import { gerarRodadas } from '@/utils/exercicio/gerar-rodadas';

export interface ExerciciosState {
  exercicios: Exercicio[];
  historico: TentativaExercicio[];
  sessao: SessaoExercicio | null;

  iniciarSessao: (exercicioId: string) => void;
  responderRodada: (respostas: string[]) => ResultadoRodada | null;
  avancarRodada: () => boolean;
  concluirSessao: () => TentativaExercicio | null;
  descartarSessao: () => void;
  registrarTentativaRelogio: (tentativa: Omit<TentativaExercicio, 'origem'>) => void;
  resetarParaMocks: () => void;
}

export const useExerciciosStore = create<ExerciciosState>()(
  persist(
    (set, get) => ({
      exercicios: exerciciosIniciaisMock,
      historico: historicoIniciaisMock,
      sessao: null,

      iniciarSessao: (exercicioId: string) => {
        const catalogado = get().exercicios.find((item) => item.id === exercicioId);
        if (!catalogado) {
          return;
        }

        const exercicio: Exercicio = {
          ...catalogado,
          rodadas: gerarRodadas(exercicioId) ?? catalogado.rodadas,
        };

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

        set({
          exercicios: get().exercicios.map((item) =>
            item.id === exercicioId ? exercicio : item
          ),
          sessao: novaSessao,
        });
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
          i === sessao.rodadaAtual && r.every((valor) => valor === '') ? [...respostas] : r
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

      registrarTentativaRelogio: (tentativa) => {
        const { historico } = get();
        if (historico.some((item) => item.id === tentativa.id)) {
          return;
        }
        set({ historico: [{ ...tentativa, origem: 'relogio' }, ...historico] });
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
