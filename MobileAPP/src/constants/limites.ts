/** Quantidade máxima de lembretes salvos, salvo ajuste em Ajustes › Desenvolvimento. */
export const LIMITE_LEMBRETES_PADRAO = 50;

/** Faixa e passo do ajuste de limite disponível só em builds de desenvolvimento. */
export const LIMITE_LEMBRETES_DEV = { minimo: 5, maximo: 500, passo: 5 } as const;

/** Quantidade máxima de sugestões guardadas por campo. */
export const LIMITE_SUGESTOES_POR_FONTE = 30;

/** Quantidade de sugestões mostradas de uma vez abaixo do campo. */
export const SUGESTOES_VISIVEIS = 5;
