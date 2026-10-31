import { descreverDia } from '@/stores/agenda-lembretes';
import type { Exercicio, NivelExercicio, TentativaExercicio } from '@/types/exercicio';
import { formatarHora } from '@/utils/texto';

/**
 * Retorna a tentativa mais recente de um exercício dentro do histórico, independentemente
 * da ordem em que os itens estão dispostos no array.
 *
 * @param historico - Coleção de tentativas registradas.
 * @param exercicioId - Identificador do exercício buscado.
 * @returns A tentativa com maior dataHora ou undefined caso nenhuma seja encontrada.
 */
export const ultimaTentativa = (
  historico: TentativaExercicio[],
  exercicioId: string
): TentativaExercicio | undefined => {
  const tentativas = historico.filter((item) => item.exercicioId === exercicioId);
  if (tentativas.length === 0) {
    return undefined;
  }

  return tentativas.reduce((maisRecente, atual) => {
    const timeMaisRecente = new Date(maisRecente.dataHora).getTime();
    const timeAtual = new Date(atual.dataHora).getTime();
    return timeAtual > timeMaisRecente ? atual : maisRecente;
  });
};

/**
 * Gera a descrição legível e acessível da última atividade realizada de um exercício.
 *
 * @param tentativa - Tentativa mais recente ou undefined se nunca tiver sido praticado.
 * @param agora - Instância atual de Date de referência para cálculo relativo de dias.
 * @returns "Ainda não praticado" ou "Última atividade: ontem às 09:15".
 */
export const descreverUltimaAtividade = (
  tentativa: TentativaExercicio | undefined,
  agora: Date
): string => {
  if (!tentativa) {
    return 'Ainda não praticado';
  }

  const data = new Date(tentativa.dataHora);
  return `Última atividade: ${descreverDia(data, agora)} às ${formatarHora(data)}`;
};

/**
 * Formata o nível de complexidade do exercício para exibição amigável na interface.
 *
 * @param nivel - Identificador do nível de dificuldade.
 * @returns Rótulo capitalizado em português.
 */
export const formatarNivel = (nivel: NivelExercicio | Exercicio['nivel']): string => {
  switch (nivel) {
    case 'facil':
      return 'Fácil';
    case 'medio':
      return 'Médio';
    case 'dificil':
      return 'Difícil';
  }
};
