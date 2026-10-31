import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TextScale } from '@/constants/theme';
import { defaultSettingsMock } from '@/mocks/settings.mock';
import type { UserSettings } from '@/types/settings';

export interface SettingsState extends UserSettings {
  /** Multiplicador numérico ativo (1.0 no modo normal, 1.2 no modo Texto ampliado). */
  textScaleFactor: number;
  /** Alterna imediatamente o modo "Texto ampliado". */
  toggleLargeText: () => void;
  /** Define explicitamente o estado do modo "Texto ampliado". */
  setLargeText: (enabled: boolean) => void;
  /** Marca a tela de boas-vindas como vista. Idempotente. */
  markSplashSeen: () => void;
  /** Restaura as configurações visuais para os valores iniciais do mock preservando hasSeenSplash. */
  resetToDefaults: () => void;
}

/**
 * Store global para controle reativo das preferências visuais e de acessibilidade do usuário.
 *
 * Gerencia o estado do modo "Texto ampliado" (`isLargeText` e `textScaleFactor`)
 * e a persistência local da flag de boas-vindas (`hasSeenSplash`).
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettingsMock,
      textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,

      toggleLargeText: () =>
        set((state) => {
          const next = !state.isLargeText;
          return {
            isLargeText: next,
            textScaleFactor: next ? TextScale.large : TextScale.normal,
          };
        }),

      setLargeText: (enabled) =>
        set(() => ({
          isLargeText: enabled,
          textScaleFactor: enabled ? TextScale.large : TextScale.normal,
        })),

      markSplashSeen: () =>
        set(() => ({
          hasSeenSplash: true,
        })),

      resetToDefaults: () =>
        set((state) => ({
          ...defaultSettingsMock,
          hasSeenSplash: state.hasSeenSplash,
          textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,
        })),
    }),
    {
      name: 'lembri-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasSeenSplash: state.hasSeenSplash }),
    },
  ),
);
