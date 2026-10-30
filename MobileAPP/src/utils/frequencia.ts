import type { DiaSemana } from '@/types/lembrete';

const NOMES: Record<DiaSemana, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

export const descreverFrequencia = (dias: DiaSemana[]): string => {
  const ordenados = [...new Set(dias)].sort();
  const chave = ordenados.join('');

  if (ordenados.length === 0) return 'Sem dias definidos';
  if (ordenados.length === 7) return 'Todos os dias';
  if (chave === '12345') return 'Segunda a sexta';
  if (chave === '06') return 'Fim de semana';
  if (ordenados.length === 1) {
    const dia = ordenados[0];
    return `${dia === 0 || dia === 6 ? 'Todo' : 'Toda'} ${NOMES[dia].toLowerCase()}`;
  }

  const nomes = ordenados.map((dia) => NOMES[dia]);
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
};
