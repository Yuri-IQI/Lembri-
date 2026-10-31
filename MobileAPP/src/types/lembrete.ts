/**
 * Dia da semana no padrão de `Date.getDay()`: 0 = domingo … 6 = sábado.
 */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Todos os dias da semana, na ordem do seletor do Figma (D S T Q Q S S). */
export const DIAS_SEMANA: readonly DiaSemana[] = [0, 1, 2, 3, 4, 5, 6];

/** Template usado para criar o lembrete; define o formulário e o que o detalhe mostra. */
export type TemplateId = 'remedio' | 'compromisso' | 'tarefa' | 'livre';

/**
 * Como um lembrete se repete. "Não repete" guarda a data única (AAAA-MM-DD).
 */
/** Quantos tipos um lembrete pode ter. */
export const LIMITE_TIPOS = 3;

export type Repeticao =
  { modo: 'nao_repete'; data: string } | { modo: 'todo_dia' } | { modo: 'dias'; dias: DiaSemana[] };

/** Campos comuns a todos os templates. */
interface LembreteBase {
  /** Identificador único do lembrete. */
  id: string;
  template: TemplateId;
  /** Título curto da atividade (ex.: "Tomar remédio"). */
  titulo: string;
  /** Tipos (categorias) do lembrete, no máximo LIMITE_TIPOS. */
  tipoIds: string[];
  /** Sempre true no remédio. Por enquanto só muda o rótulo do marcador ("Tomei"/"Fiz"). */
  exigeConfirmacao: boolean;
  /** true = alertas ligados; false = pausado (fica oculto da agenda até ser reativado). */
  ativo: boolean;
  /** Data e hora de criação no formato ISO 8601. */
  criadoEm: string;
  /** Data e hora da última alteração no formato ISO 8601. */
  atualizadoEm: string;
}

export type MinutosReaviso = 5 | 10 | 15;

export type AvisoAntes = '1h' | '1d';

export interface LembreteRemedio extends LembreteBase {
  template: 'remedio';
  /** Dose digitada e a medida (comprimido, gotas…), que aceita texto livre. */
  quantidade: { valor: number; unidade: string };
  /** Horários de alerta no padrão HH:mm, em ordem crescente. */
  horarios: string[];
  repeticao: Repeticao;
  /** Ex.: "Em jejum", "Com refeição"; texto livre com sugestões. */
  comoTomar?: string;
  /** Data de início do tratamento (AAAA-MM-DD); nunca no futuro. */
  iniciadoEm: string;
  reavisoMin: MinutosReaviso;
  observacao?: string;
}

export interface LembreteCompromisso extends LembreteBase {
  template: 'compromisso';
  /** Data do compromisso (AAAA-MM-DD). Compromisso não repete. */
  data: string;
  horario: string;
  avisarAntes: AvisoAntes[];
  participantes: string[];
  local?: string;
  oQueLevar: string[];
  observacao?: string;
}

export interface LembreteTarefa extends LembreteBase {
  template: 'tarefa';
  horarios: string[];
  repeticao: Repeticao;
  /** Campo "O que vou usar". */
  materiais: string[];
  passos: string[];
}

export interface LembreteLivre extends LembreteBase {
  template: 'livre';
  horarios: string[];
  repeticao: Repeticao;
  /** Descrição opcional com instruções da atividade. */
  descricao?: string;
}

/**
 * Lembrete do aplicativo Lembri, com os campos do template usado na criação.
 */
export type Lembrete = LembreteRemedio | LembreteCompromisso | LembreteTarefa | LembreteLivre;

type OmitirDistributivo<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/**
 * Dados preenchidos no formulário: o lembrete sem os campos gerados pela store.
 */
export type DadosLembrete = OmitirDistributivo<
  Lembrete,
  'id' | 'ativo' | 'criadoEm' | 'atualizadoEm'
>;

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

/** Dados do formulário de um template específico. */
export type DadosDoTemplate<T extends TemplateId> = Extract<DadosLembrete, { template: T }>;
