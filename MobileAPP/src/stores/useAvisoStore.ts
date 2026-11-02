import { create } from 'zustand';

export interface AvisoState {
  mensagem: string | null;
  mostrar: (mensagem: string) => void;
  fechar: () => void;
}

export const useAvisoStore = create<AvisoState>((set) => ({
  mensagem: null,
  mostrar: (mensagem) => set({ mensagem }),
  fechar: () => set({ mensagem: null }),
}));
