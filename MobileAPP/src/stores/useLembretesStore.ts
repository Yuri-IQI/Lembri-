import { create } from 'zustand';
import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type {
  CriarLembreteInput,
  Lembrete,
  OcorrenciaLembrete,
  RegistroFeito,
} from '@/types/lembrete';

/**
 * Interface que define o estado e as ações da store de lembretes.
 */
export interface LembretesState {
  /** Coleção reativa de lembretes cadastrados. */
  lembretes: Lembrete[];
  /** Histórico de ocorrências marcadas como feitas, mais recentes primeiro. */
  registros: RegistroFeito[];
  /** Armazena o último lembrete excluído para permitir reversão imediata (WCAG 3.3.6). */
  ultimoExcluido: Lembrete | null;
  /** Indica se há uma operação assíncrona em andamento. */
  isLoading: boolean;
  /** Mensagem de erro em caso de falha de operação. */
  erro: string | null;

  // Ações
  /** Adiciona um novo lembrete (ativo) à coleção de forma imutável. */
  adicionarLembrete: (input: CriarLembreteInput) => Lembrete;

  /** Atualiza os dados de um lembrete existente preservando sua posição. */
  editarLembrete: (id: string, input: Partial<CriarLembreteInput>) => void;

  /** Remove um lembrete e o guarda em `ultimoExcluido` para permitir ação de desfazer (Undo). */
  removerLembrete: (id: string) => void;

  /** Restaura o último lembrete removido para a lista ativa. */
  desfazerExclusao: () => void;

  /** Liga ou pausa os alertas de um lembrete (pausado = oculto da agenda). */
  alternarAtivo: (id: string) => void;

  /** Registra que a atividade desta ocorrência foi feita agora ("Fiz"). */
  marcarFeito: (ocorrencia: OcorrenciaLembrete) => void;

  /** Desfaz o "Fiz" de uma ocorrência. */
  desmarcarFeito: (chave: string) => void;

  /** Desassocia um tipo/categoria de todos os lembretes vinculados sem excluí-los. */
  desassociarTipo: (tipoId: string) => void;

  /** Restaura o estado da store para as fixtures iniciais do Figma. */
  resetarParaMocks: () => void;
}

/** Horários sem espaços extras, sem duplicatas e em ordem crescente. */
const normalizarHorarios = (horarios: string[]): string[] =>
  [...new Set(horarios.map((h) => h.trim()))].sort();

/**
 * Store global Zustand para gerenciamento reativo e imutável de lembretes.
 * A agenda (próximos / já passaram) é derivada em `agenda-lembretes.ts`.
 */
export const useLembretesStore = create<LembretesState>((set) => ({
  lembretes: lembretesIniciaisMock,
  registros: [],
  ultimoExcluido: null,
  isLoading: false,
  erro: null,

  adicionarLembrete: (input) => {
    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      titulo: input.titulo.trim(),
      descricao: input.descricao?.trim() || undefined,
      horarios: normalizarHorarios(input.horarios),
      dias: [...new Set(input.dias)].sort(),
      tipoId: input.tipoId,
      ativo: true,
      criadoEm: new Date().toISOString(),
    };

    set((state) => ({ lembretes: [novoLembrete, ...state.lembretes] }));
    return novoLembrete;
  },

  editarLembrete: (id, input) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id
          ? {
              ...item,
              ...(input.titulo !== undefined ? { titulo: input.titulo.trim() } : {}),
              ...(input.descricao !== undefined ? { descricao: input.descricao.trim() || undefined } : {}),
              ...(input.horarios !== undefined ? { horarios: normalizarHorarios(input.horarios) } : {}),
              ...(input.dias !== undefined ? { dias: [...new Set(input.dias)].sort() } : {}),
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

  alternarAtivo: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, ativo: !item.ativo } : item
      ),
    })),

  marcarFeito: (ocorrencia) =>
    set((state) => {
      if (state.registros.some((r) => r.chave === ocorrencia.chave)) return state;
      const registro: RegistroFeito = {
        chave: ocorrencia.chave,
        lembreteId: ocorrencia.lembrete.id,
        previstoPara: ocorrencia.quando.toISOString(),
        feitoEm: new Date().toISOString(),
        origem: 'celular',
      };
      return { registros: [registro, ...state.registros] };
    }),

  desmarcarFeito: (chave) =>
    set((state) => ({ registros: state.registros.filter((r) => r.chave !== chave) })),

  desassociarTipo: (tipoId) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.tipoId === tipoId ? { ...item, tipoId: undefined } : item
      ),
    })),

  resetarParaMocks: () =>
    set({
      lembretes: lembretesIniciaisMock,
      registros: [],
      ultimoExcluido: null,
      isLoading: false,
      erro: null,
    }),
}));
