import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { responderNotificacao } from '@/utils/responder-notificacao';

const TAREFA = 'lembri-botoes-notificacao';

/**
 * Botões "Tomei"/"Fiz" e "Lembrar em 10 min" com o app fechado ou em segundo plano: o Android
 * roda esta tarefa sem abrir o app. Precisa ser carregada antes das rotas (ver index.ts).
 */
TaskManager.defineTask<Notifications.NotificationTaskPayload>(TAREFA, async ({ data }) => {
  if (data && 'actionIdentifier' in data) await responderNotificacao(data);
});

Notifications.registerTaskAsync(TAREFA).catch((erro) =>
  console.warn('Não foi possível registrar os botões da notificação', erro)
);
