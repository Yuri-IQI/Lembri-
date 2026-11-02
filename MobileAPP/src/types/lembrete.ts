export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DIAS_SEMANA: readonly DiaSemana[] = [0, 1, 2, 3, 4, 5, 6];

export type TemplateId = 'remedio' | 'compromisso' | 'tarefa' | 'livre';

export const LIMITE_TIPOS = 3;

export type Repeticao =
  { modo: 'nao_repete'; data: string } | { modo: 'todo_dia' } | { modo: 'dias'; dias: DiaSemana[] };

interface LembreteBase {
  id: string;
  template: TemplateId;
  titulo: string;
  tipoIds: string[];
  exigeConfirmacao: boolean;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type MinutosReaviso = 5 | 10 | 15;

export type AvisoAntes = '1h' | '1d';

export interface LembreteRemedio extends LembreteBase {
  template: 'remedio';
  quantidade: { valor: number; unidade: string };
  horarios: string[];
  repeticao: Repeticao;
  comoTomar?: string;
  iniciadoEm: string;
  reavisoMin: MinutosReaviso;
  observacao?: string;
}

export interface LembreteCompromisso extends LembreteBase {
  template: 'compromisso';
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
  materiais: string[];
  passos: string[];
}

export interface LembreteLivre extends LembreteBase {
  template: 'livre';
  horarios: string[];
  repeticao: Repeticao;
  descricao?: string;
}

export type Lembrete = LembreteRemedio | LembreteCompromisso | LembreteTarefa | LembreteLivre;

type OmitirDistributivo<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type DadosLembrete = OmitirDistributivo<
  Lembrete,
  'id' | 'ativo' | 'criadoEm' | 'atualizadoEm'
>;

export interface OcorrenciaLembrete {
  chave: string;
  lembrete: Lembrete;
  horario: string;
  quando: Date;
}

export interface RegistroFeito {
  chave: string;
  lembreteId: string;
  previstoPara: string;
  feitoEm: string;
  // PENDÊNCIA: confirmações do relógio devem gerar registros com origem 'relogio'.
  origem: 'celular' | 'relogio';
}

export type DadosDoTemplate<T extends TemplateId> = Extract<DadosLembrete, { template: T }>;
