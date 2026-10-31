import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sugestoesIniciaisMock } from '@/mocks/sugestoes.mock';
import type { FonteSugestao, Sugestao } from '@/types/sugestao';
import { esquecerSugestao, registrarSugestoes } from '@/utils/sugestoes';

export interface SugestoesState {
  /** Valores já usados em cada campo com autocompletar. */
  sugestoes: Record<FonteSugestao, Sugestao[]>;
  /** Guarda os valores de um campo. Chamar só ao salvar um lembrete, nunca durante a digitação. */
  registrar: (fonte: FonteSugestao, valores: string[]) => void;
  /** Remove um valor das sugestões de um campo. */
  esquecer: (fonte: FonteSugestao, valor: string) => void;
  /** Restaura as sugestões iniciais de demonstração. */
  resetarParaMocks: () => void;
}

/**
 * Store das sugestões dos campos com autocompletar, salva no aparelho.
 * Excluir um lembrete não apaga as sugestões que ele gerou.
 */
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
