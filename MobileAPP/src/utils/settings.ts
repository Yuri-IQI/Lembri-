import { LIMITE_LEMBRETES_DEV } from '@/constants/limites';
import { defaultSettingsMock } from '@/mocks/settings.mock';
import type { UserSettings } from '@/types/settings';

export function restoreSettings(snapshot: unknown): UserSettings {
  const saved: Record<string, unknown> = snapshot && typeof snapshot === 'object' ? snapshot as Record<string, unknown> : {};
  const settings = { ...defaultSettingsMock };
  for (const key of [
    'isLargeText', 'showExerciseHints', 'hasSeenSplash', 'reminderNotificationsEnabled', 'exerciseNotificationsEnabled',
  ] as const) {
    if (key in saved && typeof saved[key] === 'boolean') settings[key] = saved[key];
  }
  if (typeof saved.reminderNotificationsEnabled !== 'boolean' && typeof saved.reminderAlerts === 'boolean') {
    settings.reminderNotificationsEnabled = saved.reminderAlerts;
  }
  if ('reminderLimit' in saved && typeof saved.reminderLimit === 'number' && Number.isFinite(saved.reminderLimit)) {
    settings.reminderLimit = Math.min(LIMITE_LEMBRETES_DEV.maximo,
      Math.max(LIMITE_LEMBRETES_DEV.minimo, Math.round(saved.reminderLimit)));
  }
  return settings;
}
