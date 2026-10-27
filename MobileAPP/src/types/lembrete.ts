/**
 * Interface que define a entidade Lembrete no aplicativo Lembri.
 */
export interface Lembrete {
  id: string;
  titulo: string;
  horario: string;
  concluido: boolean;
  criadoEm: string;
}

export type FiltroLembrete = 'todos' | 'pendentes' | 'concluidos';
