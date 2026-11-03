import type { TentativaExercicio } from '@/types/exercicio';
import { chaveData } from '@/utils/data';
import { DIAS_NOTIFICACOES } from '@/utils/notificacoes';

export const EXERCISE_NOTIFICATION_PREFIX = 'lembri:exercise:';

export interface ExerciseNotification {
  kind: 'exercise';
  id: string;
  dateKey: string;
  titulo: string;
  corpo: string;
  quando: Date;
}

/** Usa calendário local: uma mudança de horário de verão não desloca o aviso das 09h. */
export function exerciseNotifications(history: readonly TentativaExercicio[], now: Date): ExerciseNotification[] {
  const completedDays = new Set(history.map((attempt) => chaveData(new Date(attempt.dataHora))));
  const notifications: ExerciseNotification[] = [];
  for (let offset = 0; offset <= DIAS_NOTIFICACOES; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 9);
    const dateKey = chaveData(date);
    if (date <= now || completedDays.has(dateKey)) continue;
    notifications.push({ kind: 'exercise', id: `${EXERCISE_NOTIFICATION_PREFIX}${dateKey}`, dateKey,
      titulo: 'Hora de exercitar a memória', corpo: 'Escolha um exercício para praticar hoje.', quando: date });
    if (notifications.length === DIAS_NOTIFICACOES) break;
  }
  return notifications;
}
