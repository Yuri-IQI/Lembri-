import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LIMITE_LEMBRETES_DEV } from '@/constants/limites';
import { TextScale } from '@/constants/theme';
import { defaultSettingsMock } from '@/mocks/settings.mock';
import type { UserSettings } from '@/types/settings';

export interface SettingsState extends UserSettings {
  textScaleFactor: number;
  toggleLargeText: () => void;
  setLargeText: (enabled: boolean) => void;
  toggleExerciseHints: () => void;
  toggleReminderAlerts: () => void;
  markSplashSeen: () => void;
  setReminderLimit: (limit: number) => void;
  resetToDefaults: () => void;
}

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

      toggleReminderAlerts: () =>
        set((state) => ({
          reminderAlerts: !state.reminderAlerts,
        })),

      markSplashSeen: () =>
        set(() => ({
          hasSeenSplash: true,
        })),

      setReminderLimit: (limit) =>
        set(() => ({
          reminderLimit: Math.min(
            LIMITE_LEMBRETES_DEV.maximo,
            Math.max(LIMITE_LEMBRETES_DEV.minimo, Math.round(limit)),
          ),
        })),

      resetToDefaults: () =>
        set((state) => ({
          ...defaultSettingsMock,
          hasSeenSplash: state.hasSeenSplash,
          reminderLimit: state.reminderLimit,
          textScaleFactor: defaultSettingsMock.isLargeText ? TextScale.large : TextScale.normal,
        })),
    }),
    {
      name: 'lembri-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLargeText: state.isLargeText,
        textScaleFactor: state.textScaleFactor,
        showExerciseHints: state.showExerciseHints,
        reminderAlerts: state.reminderAlerts,
        hasSeenSplash: state.hasSeenSplash,
        reminderLimit: state.reminderLimit,
      }),
    },
  ),
);
