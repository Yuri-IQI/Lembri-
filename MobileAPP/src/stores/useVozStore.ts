import { create } from 'zustand';

import type { ComandoVoz, ContextoVoz } from '@/types/comando-voz';

export interface VozState extends ContextoVoz {
  aberto: boolean;
  comandosTela: ComandoVoz[];
  abaPedida: string | null;
  abrir: (contexto: ContextoVoz) => void;
  fechar: () => void;
  registrarComandos: (comandos: ComandoVoz[]) => void;
  removerComandos: (comandos: ComandoVoz[]) => void;
  pedirAba: (aba: string) => void;
  limparAbaPedida: () => void;
}

export const useVozStore = create<VozState>((set) => ({
  aberto: false,
  voltar: undefined,
  saidaProtegida: false,
  comandosTela: [],
  abaPedida: null,
  abrir: ({ voltar, saidaProtegida }) => set({ aberto: true, voltar, saidaProtegida }),
  fechar: () => set({ aberto: false, voltar: undefined, saidaProtegida: false }),
  registrarComandos: (comandos) => set({ comandosTela: comandos }),
  // A tela nova pode registrar antes da anterior sair: só remove se a lista ainda for a dela.
  removerComandos: (comandos) =>
    set((state) => (state.comandosTela === comandos ? { comandosTela: [] } : state)),
  pedirAba: (aba) => set({ abaPedida: aba }),
  limparAbaPedida: () => set({ abaPedida: null }),
}));
