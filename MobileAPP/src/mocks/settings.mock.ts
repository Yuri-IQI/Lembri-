import { LIMITE_LEMBRETES_PADRAO } from '@/constants/limites';
import type { UserSettings } from '@/types/settings';

export const defaultSettingsMock: UserSettings = {
  isLargeText: false,
  showExerciseHints: true,
  hasSeenSplash: false,
  reminderLimit: LIMITE_LEMBRETES_PADRAO,
  reminderNotificationsEnabled: true,
  exerciseNotificationsEnabled: false,
};

export function createSettingsMock(overrides?: Partial<UserSettings>): UserSettings {
  return {
    ...defaultSettingsMock,
    ...overrides,
  };
}
