import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { DadosLembrete, Lembrete, OcorrenciaLembrete, RegistroFeito } from '@/types/lembrete';
import { chaveData } from '@/utils/tempo/data';
import { migrarLembrete, type LembreteLegado, type LembreteV2 } from '@/utils/lembrete/migrar-lembrete';
import { normalizarDados } from '@/utils/lembrete/normalizar-lembrete';

export interface LembretesState {
  lembretes: Lembrete[];
  registros: RegistroFeito[];
  ocultosDaAgenda: string[];
  ultimoExcluido: Lembrete | null;
  isLoading: boolean;
  erro: string | null;

  adicionarLembrete: (dados: DadosLembrete) => Lembrete | null;

  editarLembrete: (id: string, dados: DadosLembrete) => void;

  removerLembrete: (id: string) => void;

  desfazerExclusao: () => void;

  alternarAtivo: (id: string) => void;

  marcarFeito: (
    ocorrencia: OcorrenciaLembrete,
    opcoes?: Partial<Pick<RegistroFeito, 'origem' | 'feitoEm'>>
  ) => void;

  desmarcarFeito: (chave: string) => void;

  ocultarDaAgenda: (chave: string) => void;

  desassociarTipo: (tipoId: string) => void;

  obterContadorAtivos: () => { ativos: number; total: number };

  obterContagemPorTipo: (tipoId: string) => number;

  resetarParaMocks: () => void;
}

export const podeCriarLembrete = (quantidade: number, limite: number) => quantidade < limite;

type EstadoPersistido = Pick<LembretesState, 'registros' | 'ocultosDaAgenda'> & {
  lembretes: (LembreteV2 | LembreteLegado)[];
};

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

      marcarFeito: (ocorrencia, opcoes) =>
        set((state) => {
          if (state.registros.some((r) => r.chave === ocorrencia.chave)) return state;
          const registro: RegistroFeito = {
            chave: ocorrencia.chave,
            lembreteId: ocorrencia.lembrete.id,
            previstoPara: ocorrencia.quando.toISOString(),
            feitoEm: opcoes?.feitoEm ?? new Date().toISOString(),
            origem: opcoes?.origem ?? 'celular',
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
