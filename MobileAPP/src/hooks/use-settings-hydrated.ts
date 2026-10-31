import { useSyncExternalStore } from 'react';

import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Hook customizado para monitorar a conclusão da hidratação assíncrona do Zustand persist.
 *
 * Utiliza `useSyncExternalStore` (React 19) para subscrever a conclusão da hidratação
 * sem disparar cascading renders ou violações de regras de efeitos colaterais.
 *
 * @returns {boolean} `true` quando a hidratação da store for concluída; `false` caso contrário.
 */
export function useSettingsHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribe = useSettingsStore.persist.onFinishHydration(() => {
        onStoreChange();
      });
      return unsubscribe;
    },
    () => useSettingsStore.persist.hasHydrated(),
    () => true,
  );
}
