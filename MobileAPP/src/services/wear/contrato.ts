/**
 * Aviso: espelho de WearableAPP/app/src/main/java/com/borabill/lembriwearable/
 *    data/comunicacao/ContratoComunicacao.kt (+ data/model/).
 * Mudou algo aqui? Mude lá também.
 */

export const CAPABILITY_WEAR = 'lembri_wear';

const PATH_PREFIXO = '/lembri';

export const Paths = {
  AGENDA: `${PATH_PREFIXO}/agenda`,
  EVENTOS: `${PATH_PREFIXO}/eventos`,
} as const;

export const VERSAO_CONTRATO = 1;

export const ExerciciosRelogio = {
  SEQUENCIA: 'exercicio-1',
  GUARDAR: 'exercicio-relogio-guardar',
} as const;

export type ExercicioRelogioId = (typeof ExerciciosRelogio)[keyof typeof ExerciciosRelogio];

export type LembreteAgenda = {
  chave: string;
  quando: string;
  titulo: string;
  detalhe?: string;
  feito: boolean;
};

export type AgendaRelogio = {
  v: typeof VERSAO_CONTRATO;
  geradoEm: string;
  lembretes: LembreteAgenda[];
};

export type EventoRelogio =
  | { v: typeof VERSAO_CONTRATO; tipo: 'feito'; chave: string; feitoEm: string }
  | {
      v: typeof VERSAO_CONTRATO;
      tipo: 'exercicio';
      exercicioId: ExercicioRelogioId;
      iniciadaEm: string;
      duracaoSeg: number;
      acertos: number;
      total: number;
    };
