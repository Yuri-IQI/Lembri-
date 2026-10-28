import { create } from 'zustand';
import { exerciciosIniciaisMock } from '@/mocks/exercicios.mock';
import { historicoIniciaisMock } from '@/mocks/historico-tentativas.mock';
import type { Exercicio, TentativaExercicio } from '@/types/exercicio';

/**
 * Interface que define o estado e as ações da store de exercícios cognitivos.
 */
export interface ExerciciosState {
  /** Catálogo de exercícios disponíveis. */
  exercicios: Exercicio[];
  /** Histórico de execuções e resultados de exercícios. */
  historico: TentativaExercicio[];

  // Ações
  /**
   * Registra uma nova tentativa, calcula a pontuação percentual e atualiza o streak (RN-06).
   */
  registrarTentativa: (
    exercicioId: string,
    acertos: number,
    totalQuestoes: number,
    tempoGastoSegundos: number
  ) => TentativaExercicio;

  /**
   * Retorna o histórico de execuções de um exercício específico ordenado do mais recente para o mais antigo.
   */
  obterHistoricoPorExercicio: (exercicioId: string) => TentativaExercicio[];

  /**
   * Retorna os detalhes de um exercício pelo seu identificador.
   */
  obterExercicioPorId: (exercicioId: string) => Exercicio | undefined;

  /**
   * Restaura o catálogo e histórico de exercícios para os mocks padrão do Figma.
   */
  resetarParaMocks: () => void;
}

/**
 * Store global Zustand para controle de exercícios cognitivos e progresso do usuário.
 */
export const useExerciciosStore = create<ExerciciosState>((set, get) => ({
  exercicios: exerciciosIniciaisMock,
  historico: historicoIniciaisMock,

  registrarTentativa: (exercicioId, acertos, totalQuestoes, tempoGastoSegundos) => {
    const pontuacaoPercentual =
      totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

    const novaTentativa: TentativaExercicio = {
      id: `tentativa-${Date.now()}`,
      exercicioId,
      dataHora: new Date().toISOString(),
      tempoGastoSegundos,
      acertos,
      totalQuestoes,
      pontuacaoPercentual,
    };

    set((state) => ({
      historico: [novaTentativa, ...state.historico],
      exercicios: state.exercicios.map((ex) =>
        ex.id === exercicioId
          ? {
              ...ex,
              // RN-06: incrementa a sequência de dias (streak) ao concluir com sucesso
              streakDias: pontuacaoPercentual >= 60 ? ex.streakDias + 1 : ex.streakDias,
            }
          : ex
      ),
    }));

    return novaTentativa;
  },

  obterHistoricoPorExercicio: (exercicioId) => {
    return get().historico.filter((item) => item.exercicioId === exercicioId);
  },

  obterExercicioPorId: (exercicioId) => {
    return get().exercicios.find((item) => item.id === exercicioId);
  },

  resetarParaMocks: () =>
    set({
      exercicios: exerciciosIniciaisMock,
      historico: historicoIniciaisMock,
    }),
}));
