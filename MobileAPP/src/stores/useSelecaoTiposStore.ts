import { create } from 'zustand';

import type { OpcaoTipo } from '@/components/formulario/seletor-tipo';
import { LIMITE_TIPOS } from '@/types/lembrete';

type SelecaoTiposState = {
  /** Chaves escolhidas para o lembrete que está sendo editado. */
  selecionados: string[];
  /** Tipo padrão do template que só é criado ao salvar o lembrete. */
  pendente: OpcaoTipo | null;
  /** Avisa o formulário a cada mudança; null fora de uma seleção. */
  aoAlterar: ((chaves: string[]) => void) | null;
  iniciar: (
    selecionados: string[],
    pendente: OpcaoTipo | null,
    aoAlterar: (chaves: string[]) => void
  ) => void;
  /** Marca ou desmarca; não passa de LIMITE_TIPOS. */
  alternar: (chave: string) => void;
  remover: (chave: string) => void;
};

/**
 * Liga o campo Tipo do formulário à tela de tipos: a tela escolhe, o formulário recebe na hora.
 * Não é salva no aparelho.
 */
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
