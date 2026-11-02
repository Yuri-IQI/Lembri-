import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LIMITE_LEMBRETES_DEV } from '@/constants/limites';
import { TextScale } from '@/constants/theme';
import { defaultSettingsMock } from '@/mocks/settings.mock';
import type { NotificationPreference, UserSettings } from '@/types/settings';
import { restoreSettings } from '@/utils/settings';

/** Feedback separado do estado persistido para uma falha de gravação não gerar outra gravação. */
export const useSettingsPersistenceStore = create<{
  error: string | null;
  operation: 'load' | 'save' | null;
}>(() => ({ error: null, operation: null }));

let pendingWrites: Promise<void> = Promise.resolve();

const settingsStorage = {
  getItem: async (key: string) => {
    try {
      await pendingWrites;
      const saved = await AsyncStorage.getItem(key);
      if (saved) JSON.parse(saved);
      useSettingsPersistenceStore.setState({ error: null, operation: null });
      return saved;
    } catch {
      useSettingsPersistenceStore.setState({ error: 'Não foi possível carregar suas preferências. Tente novamente.', operation: 'load' });
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    pendingWrites = pendingWrites.then(async () => {
      try {
        await AsyncStorage.setItem(key, value);
        useSettingsPersistenceStore.setState({ error: null, operation: null });
      } catch {
        useSettingsPersistenceStore.setState({ error: 'Não foi possível salvar suas preferências. Elas podem ser perdidas ao fechar o app.', operation: 'save' });
      }
    });
    await pendingWrites;
  },
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

export interface SettingsState extends UserSettings {
  /** Multiplicador numérico ativo (1.0 no modo normal, 1.2 no modo Texto ampliado). */
  textScaleFactor: number;
  /** Alterna imediatamente o modo "Texto ampliado". */
  toggleLargeText: () => void;
  /** Define explicitamente o estado do modo "Texto ampliado". */
  setLargeText: (enabled: boolean) => void;
  /** Liga ou desliga as dicas nas casas dos exercícios. */
  toggleExerciseHints: () => void;
  /** Marca a tela de boas-vindas como vista. Idempotente. */
  markSplashSeen: () => void;
  /** Define o limite de lembretes, dentro da faixa de desenvolvimento. */
  setReminderLimit: (limit: number) => void;
  /** Define somente a preferência; a integração com o sistema é reconciliada pelo hook raiz. */
  setNotificationPreference: (key: NotificationPreference, enabled: boolean) => void;
  /** Restaura a escala visual preservando boas-vindas, limite e preferências de avisos. */
  resetToDefaults: () => void;
  /** Restaura preferências ao apagar os dados, preservando boas-vindas e limite. */
  resetPreferences: () => void;
}

/**
 * Store global para controle reativo das preferências visuais e de acessibilidade do usuário.
 *
 * Gerencia o estado do modo "Texto ampliado" (`isLargeText` e `textScaleFactor`)
 * e as preferências de avisos, com migração retrocompatível e escala derivada na hidratação.
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

      toggleExerciseHints: () =>
        set((state) => ({
          showExerciseHints: !state.showExerciseHints,
        })),

      markSplashSeen: () =>
        set(() => ({
          hasSeenSplash: true,
        })),

      setNotificationPreference: (key, enabled) => set({ [key]: enabled }),

      setReminderLimit: (limit) =>
        set(() => ({
          reminderLimit: Math.min(
            LIMITE_LEMBRETES_DEV.maximo,
            Math.max(LIMITE_LEMBRETES_DEV.minimo, Math.round(limit)),
          ),
        })),

      resetPreferences: () =>
        set(() => ({
          isLargeText: defaultSettingsMock.isLargeText,
          textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,
          showExerciseHints: defaultSettingsMock.showExerciseHints,
          reminderNotificationsEnabled: defaultSettingsMock.reminderNotificationsEnabled,
          exerciseNotificationsEnabled: defaultSettingsMock.exerciseNotificationsEnabled,
        })),

      resetToDefaults: () =>
        set(() => ({
          isLargeText: defaultSettingsMock.isLargeText,
          textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,
        })),
    }),
    {
      name: 'lembri-settings',
      version: 1,
      storage: createJSONStorage(() => settingsStorage),
      migrate: (saved) => restoreSettings(saved),
      merge: (saved, current) => {
        const settings = saved == null ? current : restoreSettings(saved);
        return { ...current, ...settings, textScaleFactor: settings.isLargeText ? TextScale.large : TextScale.normal };
      },
      partialize: (state) => ({
        isLargeText: state.isLargeText,
        showExerciseHints: state.showExerciseHints,
        hasSeenSplash: state.hasSeenSplash,
        reminderLimit: state.reminderLimit,
        reminderNotificationsEnabled: state.reminderNotificationsEnabled,
        exerciseNotificationsEnabled: state.exerciseNotificationsEnabled,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) useSettingsPersistenceStore.setState({ error: 'Não foi possível carregar suas preferências. Tente novamente.', operation: 'load' });
      },
    },
  ),
);

/** Repete a operação que falhou; salvar usa o snapshot atual, sem modificar preferências. */
export const retrySettingsPersistence = async () => {
  if (useSettingsPersistenceStore.getState().operation === 'load') await useSettingsStore.persist.rehydrate();
  else useSettingsStore.setState({});
  await pendingWrites;
};
