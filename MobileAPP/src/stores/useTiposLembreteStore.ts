import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { tiposLembreteIniciaisMock } from '@/mocks/tipos-lembrete.mock';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { CriarTipoLembreteInput, TipoLembrete } from '@/types/tipo-lembrete';
import { normalizarBusca } from '@/utils/texto';

/**
 * Interface que define o estado e as ações da store de categorias de lembretes.
 */
export interface TiposLembreteState {
  /** Coleção reativa de categorias/tipos de lembrete cadastrados. */
  tipos: TipoLembrete[];

  // Ações
  /**
   * Cadastra uma nova categoria de lembrete com identificador único.
   */
  adicionarTipo: (input: CriarTipoLembreteInput) => TipoLembrete;

  /**
   * Devolve o tipo com esse nome (sem diferenciar maiúsculas e acentos) ou cria um novo.
   */
  garantirTipo: (input: CriarTipoLembreteInput) => TipoLembrete;

  /**
   * Remove uma categoria e desassocia automaticamente os lembretes vinculados (RN-04).
   */
  removerTipo: (id: string) => void;

  /**
   * Retorna a categoria correspondente ao ID informado.
   */
  obterTipoPorId: (id: string) => TipoLembrete | undefined;

  /**
   * Restaura as categorias para as fixtures iniciais de demonstração.
   */
  resetarParaMocks: () => void;
}

/**
 * Store global Zustand para gerenciamento de categorias de lembretes, salva no aparelho.
 */
export const useTiposLembreteStore = create<TiposLembreteState>()(
  persist(
    (set, get) => ({
      tipos: tiposLembreteIniciaisMock,

      adicionarTipo: (input) => {
        const novoTipo: TipoLembrete = {
          id: `tipo-${Date.now()}`,
          nome: input.nome.trim(),
          corHex: input.corHex,
          icone: input.icone,
        };

        set((state) => ({
          tipos: [...state.tipos, novoTipo],
        }));

        return novoTipo;
      },

      garantirTipo: (input) => {
        const nome = normalizarBusca(input.nome);
        return (
          get().tipos.find((tipo) => normalizarBusca(tipo.nome) === nome) ??
          get().adicionarTipo(input)
        );
      },

      removerTipo: (id) => {
        // RN-04: Desassocia os lembretes vinculados a este tipo sem excluí-los
        useLembretesStore.getState().desassociarTipo(id);

        set((state) => ({
          tipos: state.tipos.filter((tipo) => tipo.id !== id),
        }));
      },

      obterTipoPorId: (id) => {
        return get().tipos.find((tipo) => tipo.id === id);
      },

      resetarParaMocks: () =>
        set({
          tipos: tiposLembreteIniciaisMock,
        }),
    }),
    {
      name: 'lembri-tipos',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ tipos: state.tipos }),
    },
  ),
);
