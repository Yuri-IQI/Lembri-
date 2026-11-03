import { create } from 'zustand';

export interface AvisoState {
  /** Mensagem de sucesso mostrada na próxima tela (ex.: depois de salvar e voltar). */
  mensagem: string | null;
  /** Impede que uma confirmação de lembrete apareça durante um exercício e vice-versa. */
  scope: 'reminder' | 'exercise';
  mostrar: (mensagem: string, scope?: AvisoState['scope']) => void;
  fechar: () => void;
}

/**
 * Aviso de sucesso compartilhado entre telas, para o toast sobreviver à navegação.
 */
export const useAvisoStore = create<AvisoState>((set) => ({
  mensagem: null,
  scope: 'reminder',
  mostrar: (mensagem, scope = 'reminder') => set({ mensagem, scope }),
  fechar: () => set({ mensagem: null }),
}));
