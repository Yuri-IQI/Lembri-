import { create } from 'zustand';
import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type { FiltroLembrete, Lembrete } from '@/types/lembrete';

interface LembretesState {
  lembretes: Lembrete[];
  filtro: FiltroLembrete;
  isLoading: boolean;
  erro: string | null;

  // Ações
  adicionarLembrete: (titulo: string, horario?: string) => Lembrete;
  toggleConcluido: (id: string) => void;
  removerLembrete: (id: string) => void;
  definirFiltro: (filtro: FiltroLembrete) => void;
  sincronizarComRelogio: (id: string, concluidoNoRelogio: boolean) => void;
  resetarParaMocks: () => void;
}

export const useLembretesStore = create<LembretesState>((set) => ({
  lembretes: lembretesIniciaisMock,
  filtro: 'todos',
  isLoading: false,
  erro: null,

  adicionarLembrete: (titulo, horario) => {
    const horaAtual = horario || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      horario: horaAtual,
      concluido: false,
      criadoEm: new Date().toISOString(),
    };

    set((state) => ({
      lembretes: [novoLembrete, ...state.lembretes],
    }));

    return novoLembrete;
  },

  toggleConcluido: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      ),
    })),

  removerLembrete: (id) =>
    set((state) => ({
      lembretes: state.lembretes.filter((item) => item.id !== id),
    })),

  definirFiltro: (filtro) => set({ filtro }),

  sincronizarComRelogio: (id, concluidoNoRelogio) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, concluido: concluidoNoRelogio } : item
      ),
    })),

  resetarParaMocks: () => set({ lembretes: lembretesIniciaisMock }),
}));
