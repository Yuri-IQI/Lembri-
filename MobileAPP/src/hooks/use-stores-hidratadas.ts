import { useSyncExternalStore } from 'react';

import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSugestoesStore } from '@/stores/useSugestoesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';

const STORES = [
  useSettingsStore,
  useLembretesStore,
  useTiposLembreteStore,
  useSugestoesStore,
  useExerciciosStore,
];

const assinar = (avisar: () => void) => {
  const cancelamentos = STORES.map((store) => store.persist.onFinishHydration(avisar));
  return () => cancelamentos.forEach((cancelar) => cancelar());
};

const todasHidratadas = () => STORES.every((store) => store.persist.hasHydrated());

export const useStoresHidratadas = (): boolean =>
  useSyncExternalStore(assinar, todasHidratadas, () => true);
