import { useShallow } from 'zustand/react/shallow';

import { useSugestoesStore } from '@/stores/useSugestoesStore';
import type { FonteSugestao } from '@/types/sugestao';
import { buscarSugestoes, existeSugestao } from '@/utils/dados/sugestoes';
import { normalizarBusca } from '@/utils/texto/texto';

export const useSugestoesDoCampo = (fonte: FonteSugestao, texto: string, escolhidos: string[]) => {
  const { sugestoes, esquecer } = useSugestoesStore(
    useShallow((state) => ({ sugestoes: state.sugestoes[fonte], esquecer: state.esquecer })),
  );
  const jaEscolhidos = new Set(escolhidos.map(normalizarBusca));
  const disponiveis = sugestoes.filter((s) => !jaEscolhidos.has(normalizarBusca(s.valor)));
  const digitado = texto.trim();
  const novo =
    digitado && !existeSugestao(sugestoes, digitado) && !jaEscolhidos.has(normalizarBusca(digitado))
      ? digitado
      : undefined;

  return {
    visiveis: buscarSugestoes(disponiveis, digitado),
    novo,
    esquecer: (valor: string) => esquecer(fonte, valor),
  };
};
