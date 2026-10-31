import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { DadosLembrete, Lembrete, OcorrenciaLembrete, RegistroFeito } from '@/types/lembrete';
import { chaveData } from '@/utils/data';
import { migrarLembrete, type LembreteLegado, type LembreteV2 } from '@/utils/migrar-lembrete';
import { normalizarDados } from '@/utils/normalizar-lembrete';

/**
 * Interface que define o estado e as ações da store de lembretes.
 */
export interface LembretesState {
  /** Coleção reativa de lembretes cadastrados. */
  lembretes: Lembrete[];
  /** Histórico de ocorrências marcadas como feitas, mais recentes primeiro. */
  registros: RegistroFeito[];
  /** Grupos (`id@AAAA-MM-DD`) já feitos que a pessoa tirou de "A seguir". */
  ocultosDaAgenda: string[];
  /** Armazena o último lembrete excluído para permitir reversão imediata (WCAG 3.3.6). */
  ultimoExcluido: Lembrete | null;
  /** Indica se há uma operação assíncrona em andamento. */
  isLoading: boolean;
  /** Mensagem de erro em caso de falha de operação. */
  erro: string | null;

  // Ações
  /** Adiciona um novo lembrete (ativo). Retorna null se o limite de lembretes foi atingido. */
  adicionarLembrete: (dados: DadosLembrete) => Lembrete | null;

  /** Substitui os dados de um lembrete mantendo id, template, estado e posição. */
  editarLembrete: (id: string, dados: DadosLembrete) => void;

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

  /** Tira um grupo já feito de "A seguir"; ele volta a aparecer em "Já passaram" depois do horário. */
  ocultarDaAgenda: (chave: string) => void;

  /** Desassocia um tipo/categoria de todos os lembretes vinculados sem excluí-los. */
  desassociarTipo: (tipoId: string) => void;

  /** Quantos lembretes estão com os alertas ligados e quantos existem (RN-01). */
  obterContadorAtivos: () => { ativos: number; total: number };

  /** Quantos lembretes usam este tipo. */
  obterContagemPorTipo: (tipoId: string) => number;

  /** Restaura o estado da store para as fixtures iniciais do Figma. */
  resetarParaMocks: () => void;
}

/** Se ainda cabe mais um lembrete dentro do limite configurado. */
export const podeCriarLembrete = (quantidade: number, limite: number) => quantidade < limite;

type EstadoPersistido = Pick<LembretesState, 'registros' | 'ocultosDaAgenda'> & {
  lembretes: (LembreteV2 | LembreteLegado)[];
};

/**
 * Store global Zustand para gerenciamento reativo e imutável de lembretes, salva no aparelho.
 * A agenda (próximos / já passaram) é derivada em `agenda-lembretes.ts`.
 */
export const useLembretesStore = create<LembretesState>()(
  persist(
    (set, get) => ({
      lembretes: lembretesIniciaisMock,
      registros: [],
      ocultosDaAgenda: [],
      ultimoExcluido: null,
      isLoading: false,
      erro: null,

      adicionarLembrete: (dados) => {
        const { reminderLimit } = useSettingsStore.getState();
        if (!podeCriarLembrete(get().lembretes.length, reminderLimit)) return null;

        const agora = new Date().toISOString();
        const novoLembrete: Lembrete = {
          ...normalizarDados(dados),
          id: Date.now().toString(),
          ativo: true,
          criadoEm: agora,
          atualizadoEm: agora,
        };

        set((state) => ({ lembretes: [novoLembrete, ...state.lembretes] }));
        return novoLembrete;
      },

      editarLembrete: (id, dados) =>
        set((state) => ({
          lembretes: state.lembretes.map((item) =>
            item.id === id && item.template === dados.template
              ? {
                  ...normalizarDados(dados),
                  id: item.id,
                  ativo: item.ativo,
                  criadoEm: item.criadoEm,
                  atualizadoEm: new Date().toISOString(),
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

      ocultarDaAgenda: (chave) =>
        set((state) => {
          const hoje = chaveData(new Date());
          const vigentes = state.ocultosDaAgenda.filter((item) => item.split('@')[1] >= hoje);
          return { ocultosDaAgenda: [...vigentes, chave] };
        }),

      desassociarTipo: (tipoId) =>
        set((state) => ({
          lembretes: state.lembretes.map((item) =>
            item.tipoIds.includes(tipoId)
              ? { ...item, tipoIds: item.tipoIds.filter((id) => id !== tipoId) }
              : item
          ),
        })),

      obterContadorAtivos: () => {
        const { lembretes } = get();
        return { ativos: lembretes.filter((item) => item.ativo).length, total: lembretes.length };
      },

      obterContagemPorTipo: (tipoId) =>
        get().lembretes.filter((item) => item.tipoIds.includes(tipoId)).length,

      resetarParaMocks: () =>
        set({
          lembretes: lembretesIniciaisMock,
          registros: [],
          ocultosDaAgenda: [],
          ultimoExcluido: null,
          isLoading: false,
          erro: null,
        }),
    }),
    {
      name: 'lembri-lembretes',
      version: 4,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lembretes: state.lembretes,
        registros: state.registros,
        ocultosDaAgenda: state.ocultosDaAgenda,
      }),
      migrate: (persistido) => {
        const estado = persistido as Partial<EstadoPersistido>;
        return {
          lembretes: (estado.lembretes ?? lembretesIniciaisMock).map(migrarLembrete),
          registros: estado.registros ?? [],
          ocultosDaAgenda: estado.ocultosDaAgenda ?? [],
        } as LembretesState;
      },
    }
  )
);
