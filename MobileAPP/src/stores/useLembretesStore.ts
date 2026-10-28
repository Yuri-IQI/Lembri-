import { create } from 'zustand';
import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type { CriarLembreteInput, FiltroLembrete, Lembrete } from '@/types/lembrete';

/**
 * Interface que define o estado e as ações da store de lembretes.
 */
export interface LembretesState {
  /** Coleção reativa de lembretes cadastrados. */
  lembretes: Lembrete[];
  /** Filtro de visualização ativo. */
  filtro: FiltroLembrete;
  /** Armazena o último lembrete excluído para permitir reversão imediata (WCAG 3.3.6). */
  ultimoExcluido: Lembrete | null;
  /** Indica se há uma operação assíncrona em andamento. */
  isLoading: boolean;
  /** Mensagem de erro em caso de falha de operação. */
  erro: string | null;

  // Ações
  /**
   * Adiciona um novo lembrete à coleção de forma imutável.
   * Suporta objeto de entrada ou parâmetros posicionais para retrocompatibilidade.
   */
  adicionarLembrete: (inputOrTitulo: CriarLembreteInput | string, horario?: string) => Lembrete;

  /**
   * Atualiza os dados de um lembrete existente preservando sua posição.
   */
  editarLembrete: (id: string, input: Partial<CriarLembreteInput>) => void;

  /**
   * Remove um lembrete e o guarda em `ultimoExcluido` para permitir ação de desfazer (Undo).
   */
  removerLembrete: (id: string) => void;

  /**
   * Restaura o último lembrete removido para a lista ativa.
   */
  desfazerExclusao: () => void;

  /**
   * Alterna o status de conclusão do lembrete.
   */
  toggleConcluido: (id: string) => void;

  /**
   * Marca o lembrete como concluído com sinalização de origem no relógio Wear OS.
   */
  marcarConcluidoWear: (id: string) => void;

  /**
   * Sincroniza o status de conclusão de um lembrete com o retorno do relógio.
   */
  sincronizarComRelogio: (id: string, concluidoNoRelogio: boolean) => void;

  /**
   * Desassocia um tipo/categoria de todos os lembretes vinculados sem excluí-los.
   */
  desassociarTipo: (tipoId: string) => void;

  /**
   * Altera o filtro ativo para exibição de itens na listagem.
   */
  definirFiltro: (filtro: FiltroLembrete) => void;

  /**
   * Restaura o estado da store para as fixtures iniciais do Figma.
   */
  resetarParaMocks: () => void;
}

/**
 * Store global Zustand para gerenciamento reativo e imutável de lembretes.
 */
export const useLembretesStore = create<LembretesState>((set) => ({
  lembretes: lembretesIniciaisMock,
  filtro: 'todos',
  ultimoExcluido: null,
  isLoading: false,
  erro: null,

  adicionarLembrete: (inputOrTitulo, horario) => {
    let titulo: string;
    let horaFormatada: string;
    let tipoId: string | undefined;

    if (typeof inputOrTitulo === 'string') {
      titulo = inputOrTitulo.trim();
      horaFormatada =
        horario ||
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      titulo = inputOrTitulo.titulo.trim();
      horaFormatada =
        inputOrTitulo.horario ||
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      tipoId = inputOrTitulo.tipoId;
    }

    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      titulo,
      horario: horaFormatada,
      tipoId,
      concluido: false,
      criadoEm: new Date().toISOString(),
    };

    set((state) => ({
      lembretes: [novoLembrete, ...state.lembretes],
    }));

    return novoLembrete;
  },

  editarLembrete: (id, input) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id
          ? {
              ...item,
              ...(input.titulo !== undefined ? { titulo: input.titulo.trim() } : {}),
              ...(input.horario !== undefined ? { horario: input.horario } : {}),
              ...(input.tipoId !== undefined ? { tipoId: input.tipoId } : {}),
            }
          : item
      ),
    })),

  removerLembrete: (id) =>
    set((state) => {
      const itemParaRemover = state.lembretes.find((l) => l.id === id) || null;
      return {
        ultimoExcluido: itemParaRemover,
        lembretes: state.lembretes.filter((item) => item.id !== id),
      };
    }),

  desfazerExclusao: () =>
    set((state) => {
      if (!state.ultimoExcluido) return state;
      return {
        lembretes: [state.ultimoExcluido, ...state.lembretes],
        ultimoExcluido: null,
      };
    }),

  toggleConcluido: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      ),
    })),

  marcarConcluidoWear: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, concluido: true, concluidoNoWear: true } : item
      ),
    })),

  sincronizarComRelogio: (id, concluidoNoRelogio) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id
          ? { ...item, concluido: concluidoNoRelogio, concluidoNoWear: concluidoNoRelogio }
          : item
      ),
    })),

  desassociarTipo: (tipoId) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.tipoId === tipoId ? { ...item, tipoId: undefined } : item
      ),
    })),

  definirFiltro: (filtro) => set({ filtro }),

  resetarParaMocks: () =>
    set({
      lembretes: lembretesIniciaisMock,
      filtro: 'todos',
      ultimoExcluido: null,
      isLoading: false,
      erro: null,
    }),
}));
