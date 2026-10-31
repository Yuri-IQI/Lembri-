/**
 * Dia da semana no padrão de `Date.getDay()`: 0 = domingo … 6 = sábado.
 */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Todos os dias da semana, na ordem do seletor do Figma (D S T Q Q S S). */
export const DIAS_SEMANA: readonly DiaSemana[] = [0, 1, 2, 3, 4, 5, 6];

/**
 * Interface que define a entidade Lembrete no aplicativo Lembri.
 */
export interface Lembrete {
  /** Identificador único do lembrete. */
  id: string;
  /** Título curto da atividade (ex.: "Tomar remédio"). */
  titulo: string;
  /** Descrição opcional com instruções da atividade. */
  descricao?: string;
  /** Horários de alerta no padrão HH:mm, em ordem crescente (ex.: ["12:00", "18:00"]). */
  horarios: string[];
  /** Dias da semana em que o lembrete alerta. Os 7 dias = "todos os dias". */
  dias: DiaSemana[];
  /** Identificador opcional da categoria/tipo de lembrete. */
  tipoId?: string;
  /** true = alertas ligados; false = pausado (fica oculto da agenda até ser reativado). */
  ativo: boolean;
  /** Se o lembrete exige confirmação explícita no celular/relógio (ex.: remédio). */
  exigeConfirmacao?: boolean;
  /** Identificador do template original utilizado na criação. */
  templateOrigem?: 'remedio' | 'compromisso' | 'livre';
  /** Data e hora de criação no formato ISO 8601. */
  criadoEm: string;
}

/**
 * Uma ocorrência de lembrete na agenda: um dos horários de um lembrete ativo num dia específico.
 * É derivada (não fica salva); serve para montar as seções da Home.
 */
export interface OcorrenciaLembrete {
  /** Chave estável da ocorrência: `<id do lembrete>@<AAAA-MM-DD>T<HH:mm>`. */
  chave: string;
  lembrete: Lembrete;
  /** Horário desta ocorrência (HH:mm). */
  horario: string;
  /** Data e hora exatas da ocorrência. */
  quando: Date;
}

/**
 * Registro de que a pessoa fez a atividade de uma ocorrência ("Fiz"). Forma o histórico
 * ("Últimas vezes" do frame `detalhe lembrete`).
 */
export interface RegistroFeito {
  /** Mesma chave da ocorrência marcada: há no máximo um registro por ocorrência. */
  chave: string;
  lembreteId: string;
  /** Data e hora previstas da ocorrência, em ISO 8601. */
  previstoPara: string;
  /** Data e hora em que foi marcado como feito, em ISO 8601. */
  feitoEm: string;
  // PENDÊNCIA: confirmações do relógio devem gerar registros com origem 'relogio'.
  origem: 'celular' | 'relogio';
}

/**
 * Dados de entrada para criação ou atualização de um lembrete.
 */
export interface CriarLembreteInput {
  titulo: string;
  horarios: string[];
  dias: DiaSemana[];
  tipoId?: string;
  descricao?: string;
  exigeConfirmacao?: boolean;
  templateOrigem?: 'remedio' | 'compromisso' | 'livre';
}
