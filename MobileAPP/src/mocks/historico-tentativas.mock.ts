import type { TentativaExercicio } from '@/types/exercicio';

const criarDataRelativa = (diasAtras: number, horas: number, minutos: number): string => {
  const data = new Date();
  data.setDate(data.getDate() - diasAtras);
  data.setHours(horas, minutos, 0, 0);
  return data.toISOString();
};

/**
 * Histórico inicial mockado de tentativas de exercícios para o frame de detalhes e cálculo de streak.
 * Totais coerentes com as rodadas reais (Sequências: 15 itens, Ordenação: 12, Associações: 12).
 * Lista de compras (exercicio-4) deliberadamente não possui histórico para validar o estado C5.
 */
export const historicoIniciaisMock: TentativaExercicio[] = [
  {
    id: 'tentativa-1',
    exercicioId: 'exercicio-1',
    dataHora: criarDataRelativa(0, 9, 15),
    tempoGastoSegundos: 140,
    acertos: 15,
    totalQuestoes: 15,
    pontuacaoPercentual: 100,
  },
  {
    id: 'tentativa-2',
    exercicioId: 'exercicio-2',
    dataHora: criarDataRelativa(1, 15, 20),
    tempoGastoSegundos: 210,
    acertos: 10,
    totalQuestoes: 12,
    pontuacaoPercentual: 83,
  },
  {
    id: 'tentativa-3',
    exercicioId: 'exercicio-3',
    dataHora: criarDataRelativa(2, 11, 0),
    tempoGastoSegundos: 180,
    acertos: 12,
    totalQuestoes: 12,
    pontuacaoPercentual: 100,
  },
];

/**
 * Fábrica para geração de tentativas de exercício mockadas.
 */
export const criarTentativaMock = (
  override: Partial<TentativaExercicio> = {}
): TentativaExercicio => {
  const acertos = override.acertos ?? 4;
  const totalQuestoes = override.totalQuestoes ?? 5;
  const pontuacaoPercentual =
    override.pontuacaoPercentual ?? Math.round((acertos / totalQuestoes) * 100);

  return {
    id: `tentativa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    exercicioId: 'exercicio-1',
    dataHora: new Date().toISOString(),
    tempoGastoSegundos: 120,
    acertos,
    totalQuestoes,
    pontuacaoPercentual,
    ...override,
  };
};
