/**
 * Interface que define a entidade Lembrete no aplicativo Lembri.
 */
export interface Lembrete {
  /** Identificador único do lembrete. */
  id: string;
  /** Título ou descrição da tarefa/remédio. */
  titulo: string;
  /** Horário formatado no padrão HH:mm (ex: "08:00"). */
  horario: string;
  /** Identificador opcional da categoria/tipo de lembrete. */
  tipoId?: string;
  /** Indica se o lembrete foi concluído. */
  concluido: boolean;
  /** Indica se a conclusão foi registrada a partir do relógio inteligente (Wear OS). */
  concluidoNoWear?: boolean;
  /** Data e hora de criação no formato ISO 8601. */
  criadoEm: string;
}

/**
 * Critérios de filtragem para a listagem de lembretes.
 */
export type FiltroLembrete = 'todos' | 'pendentes' | 'concluidos';

/**
 * Dados de entrada para criação ou atualização de um lembrete.
 */
export interface CriarLembreteInput {
  titulo: string;
  horario: string;
  tipoId?: string;
}
