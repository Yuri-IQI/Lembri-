import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { responderNotificacao } from '@/utils/notificacoes/responder-notificacao';

const TAREFA = 'lembri-botoes-notificacao';

TaskManager.defineTask<Notifications.NotificationTaskPayload>(TAREFA, async ({ data }) => {
  if (data && 'actionIdentifier' in data) await responderNotificacao(data);
});

Notifications.registerTaskAsync(TAREFA).catch((erro) =>
  console.warn('Não foi possível registrar os botões da notificação', erro)
);
