export interface UserSettings {
  isLargeText: boolean;
  showExerciseHints: boolean;
  hasSeenSplash: boolean;
  reminderLimit: number;
  reminderNotificationsEnabled: boolean;
  /** Aviso diário às 09h enquanto não houver exercício concluído no dia. */
  exerciseNotificationsEnabled: boolean;
}

export type NotificationPreference =
  | 'reminderNotificationsEnabled'
  | 'exerciseNotificationsEnabled';
