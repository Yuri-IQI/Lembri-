import { create } from 'zustand';

export interface AvisoState {
  /** Mensagem de sucesso mostrada na próxima tela (ex.: depois de salvar e voltar). */
  mensagem: string | null;
  mostrar: (mensagem: string) => void;
  fechar: () => void;
}

/**
 * Aviso de sucesso compartilhado entre telas, para o toast sobreviver à navegação.
 */
export const useAvisoStore = create<AvisoState>((set) => ({
  mensagem: null,
  mostrar: (mensagem) => set({ mensagem }),
  fechar: () => set({ mensagem: null }),
}));
