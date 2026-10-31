import { useSyncExternalStore } from 'react';

import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSugestoesStore } from '@/stores/useSugestoesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';

const STORES = [useSettingsStore, useLembretesStore, useTiposLembreteStore, useSugestoesStore];

const assinar = (avisar: () => void) => {
  const cancelamentos = STORES.map((store) => store.persist.onFinishHydration(avisar));
  return () => cancelamentos.forEach((cancelar) => cancelar());
};

const todasHidratadas = () => STORES.every((store) => store.persist.hasHydrated());

/**
 * `true` quando todas as stores salvas no aparelho terminaram de carregar.
 * Evita mostrar os dados de demonstração antes dos dados salvos.
 */
export const useStoresHidratadas = (): boolean =>
  useSyncExternalStore(assinar, todasHidratadas, () => true);
