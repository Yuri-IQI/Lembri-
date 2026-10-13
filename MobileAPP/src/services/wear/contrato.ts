/**
 * Contrato de comunicação celular ⇄ relógio.
 *
 * ⚠️ Espelho de WearableAPP/app/src/main/java/com/borabill/lembriwearable/
 *    data/comunicacao/ContratoComunicacao.kt (+ data/model/Lembrete.kt).
 * Mudou algo aqui? Mude lá também.
 */

/** Capabilities declaradas nos `res/values/wear.xml` de cada app. */
export const CAPABILITY_MOBILE = 'lembri_mobile';
export const CAPABILITY_WEAR = 'lembri_wear';

const PATH_PREFIXO = '/lembri';

export const Paths = {
  /** Celular → relógio. Payload: `Lembrete`. */
  LEMBRETE: `${PATH_PREFIXO}/lembrete`,
  /** Relógio → celular. Payload: `Confirmacao`. */
  CONFIRMACAO: `${PATH_PREFIXO}/confirmacao`,
} as const;

/** Lembrete enviado ao relógio. */
export type Lembrete = {
  id: string;
  titulo: string;
  /** Já formatado para exibição, ex.: "08:30". */
  horario: string;
};

/** Resposta do relógio quando o usuário conclui um lembrete. */
export type Confirmacao = {
  lembreteId: string;
  /** Epoch em milissegundos. */
  concluidoEm: number;
};
