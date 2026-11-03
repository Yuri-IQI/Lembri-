/** Discriminador opcional nos lembretes para aceitar agendamentos de versões anteriores. */
export interface ReminderNotificationData {
  kind?: 'reminder';
  lembreteId: string;
  ocorrencia: string;
  assinatura?: string;
}

export interface ExerciseNotificationData {
  kind: 'exercise';
  dateKey: string;
  assinatura?: string;
}

export type AppNotificationData = ReminderNotificationData | ExerciseNotificationData;
