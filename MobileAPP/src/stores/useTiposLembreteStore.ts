import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { tiposLembreteIniciaisMock } from '@/mocks/tipos-lembrete.mock';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { CriarTipoLembreteInput, TipoLembrete } from '@/types/tipo-lembrete';
import { normalizarBusca } from '@/utils/texto/texto';

export interface TiposLembreteState {
  tipos: TipoLembrete[];

  adicionarTipo: (input: CriarTipoLembreteInput) => TipoLembrete;

  garantirTipo: (input: CriarTipoLembreteInput) => TipoLembrete;

  removerTipo: (id: string) => void;

  obterTipoPorId: (id: string) => TipoLembrete | undefined;

  resetarParaMocks: () => void;
}

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
