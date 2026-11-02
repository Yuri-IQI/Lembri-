import { create } from 'zustand';

import type { OpcaoTipo } from '@/components/formulario/selecao/seletor-tipo';
import { LIMITE_TIPOS } from '@/types/lembrete';

type SelecaoTiposState = {
  selecionados: string[];
  pendente: OpcaoTipo | null;
  aoAlterar: ((chaves: string[]) => void) | null;
  iniciar: (
    selecionados: string[],
    pendente: OpcaoTipo | null,
    aoAlterar: (chaves: string[]) => void
  ) => void;
  alternar: (chave: string) => void;
  remover: (chave: string) => void;
};

export const useSelecaoTiposStore = create<SelecaoTiposState>((set, get) => {
  const definir = (selecionados: string[]) => {
    set({ selecionados });
    get().aoAlterar?.(selecionados);
  };

  return {
    selecionados: [],
    pendente: null,
    aoAlterar: null,
    iniciar: (selecionados, pendente, aoAlterar) => set({ selecionados, pendente, aoAlterar }),
    alternar: (chave) => {
      const { selecionados } = get();
      if (selecionados.includes(chave)) definir(selecionados.filter((item) => item !== chave));
      else if (selecionados.length < LIMITE_TIPOS) definir([...selecionados, chave]);
    },
    remover: (chave) => {
      const { selecionados } = get();
      if (selecionados.includes(chave)) definir(selecionados.filter((item) => item !== chave));
    },
  };
});
