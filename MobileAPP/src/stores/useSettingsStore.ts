import { create } from 'zustand';

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
  /** Restaura as configurações visuais para os valores iniciais do mock. */
  resetToDefaults: () => void;
}

/**
 * Store global para controle reativo das preferências visuais e de acessibilidade do usuário.
 *
 * Gerencia o estado do modo "Texto ampliado" (`isLargeText` e `textScaleFactor`),
 * permitindo que `useTheme` e `ThemedText` escalem a tipografia instantaneamente em todo o app.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
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

  resetToDefaults: () =>
    set(() => ({
      ...defaultSettingsMock,
      textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,
    })),
}));
