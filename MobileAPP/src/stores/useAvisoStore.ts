import { create } from 'zustand';

export interface AvisoState {
  mensagem: string | null;
  scope: 'reminder' | 'exercise';
  mostrar: (mensagem: string, scope?: AvisoState['scope']) => void;
  fechar: () => void;
}

export const useAvisoStore = create<AvisoState>((set) => ({
  mensagem: null,
  scope: 'reminder',
  mostrar: (mensagem, scope = 'reminder') => set({ mensagem, scope }),
  fechar: () => set({ mensagem: null }),
}));
