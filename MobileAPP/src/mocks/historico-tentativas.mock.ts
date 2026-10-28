import type { TentativaExercicio } from '@/types/exercicio';

/**
 * Histórico inicial mockado de tentativas de exercícios para o frame de detalhes/resumo.
 */
export const historicoIniciaisMock: TentativaExercicio[] = [
  {
    id: 'tentativa-1',
    exercicioId: 'exercicio-1',
    dataHora: '2026-10-27T09:15:00.000Z',
    tempoGastoSegundos: 140,
    acertos: 5,
    totalQuestoes: 5,
    pontuacaoPercentual: 100,
  },
  {
    id: 'tentativa-2',
    exercicioId: 'exercicio-2',
    dataHora: '2026-10-26T15:20:00.000Z',
    tempoGastoSegundos: 210,
    acertos: 4,
    totalQuestoes: 5,
    pontuacaoPercentual: 80,
  },
  {
    id: 'tentativa-3',
    exercicioId: 'exercicio-3',
    dataHora: '2026-10-25T11:00:00.000Z',
    tempoGastoSegundos: 180,
    acertos: 6,
    totalQuestoes: 6,
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
