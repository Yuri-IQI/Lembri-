import { LIMITE_SUGESTOES_POR_FONTE, SUGESTOES_VISIVEIS } from '@/constants/limites';
import type { Sugestao } from '@/types/sugestao';
import { normalizarBusca } from '@/utils/texto/texto';

const maisRecentePrimeiro = (a: Sugestao, b: Sugestao) =>
  b.usadoEm.localeCompare(a.usadoEm) || b.vezes - a.vezes;

export const registrarSugestoes = (
  atuais: Sugestao[],
  valores: string[],
  usadoEm: string
): Sugestao[] => {
  const proximas = [...atuais];
  for (const bruto of valores) {
    const valor = bruto.trim();
    if (!valor) continue;
    const chave = normalizarBusca(valor);
    const indice = proximas.findIndex((s) => normalizarBusca(s.valor) === chave);
    if (indice >= 0) {
      proximas[indice] = { valor, usadoEm, vezes: proximas[indice].vezes + 1 };
    } else {
      proximas.push({ valor, usadoEm, vezes: 1 });
    }
  }
  return proximas.sort(maisRecentePrimeiro).slice(0, LIMITE_SUGESTOES_POR_FONTE);
};

export const esquecerSugestao = (atuais: Sugestao[], valor: string): Sugestao[] => {
  const chave = normalizarBusca(valor);
  return atuais.filter((s) => normalizarBusca(s.valor) !== chave);
};

export const buscarSugestoes = (
  sugestoes: Sugestao[],
  texto: string,
  limite: number = SUGESTOES_VISIVEIS
): Sugestao[] => {
  const busca = normalizarBusca(texto);
  return sugestoes
    .filter((s) => normalizarBusca(s.valor).includes(busca))
    .sort(maisRecentePrimeiro)
    .slice(0, limite);
};

export const existeSugestao = (sugestoes: Sugestao[], texto: string): boolean => {
  const busca = normalizarBusca(texto);
  return sugestoes.some((s) => normalizarBusca(s.valor) === busca);
};
