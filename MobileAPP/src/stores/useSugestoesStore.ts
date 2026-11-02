import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sugestoesIniciaisMock } from '@/mocks/sugestoes.mock';
import type { FonteSugestao, Sugestao } from '@/types/sugestao';
import { esquecerSugestao, registrarSugestoes } from '@/utils/dados/sugestoes';

export interface SugestoesState {
  sugestoes: Record<FonteSugestao, Sugestao[]>;
  registrar: (fonte: FonteSugestao, valores: string[]) => void;
  esquecer: (fonte: FonteSugestao, valor: string) => void;
  resetarParaMocks: () => void;
}

export const useSugestoesStore = create<SugestoesState>()(
  persist(
    (set) => ({
      sugestoes: sugestoesIniciaisMock,

      registrar: (fonte, valores) =>
        set((state) => ({
          sugestoes: {
            ...state.sugestoes,
            [fonte]: registrarSugestoes(state.sugestoes[fonte], valores, new Date().toISOString()),
          },
        })),

      esquecer: (fonte, valor) =>
        set((state) => ({
          sugestoes: {
            ...state.sugestoes,
            [fonte]: esquecerSugestao(state.sugestoes[fonte], valor),
          },
        })),

      resetarParaMocks: () => set({ sugestoes: sugestoesIniciaisMock }),
    }),
    {
      name: 'lembri-sugestoes',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sugestoes: state.sugestoes }),
      merge: (persistido, atual) => ({
        ...atual,
        sugestoes: {
          ...atual.sugestoes,
          ...(persistido as Partial<Pick<SugestoesState, 'sugestoes'>> | undefined)?.sugestoes,
        },
      }),
    }
  )
);
