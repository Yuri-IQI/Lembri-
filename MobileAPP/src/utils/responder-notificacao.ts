import * as Notifications from 'expo-notifications';

import { useLembretesStore } from '@/stores/useLembretesStore';
import { useNotificationSyncStore } from '@/stores/useNotificationSyncStore';
import { useSettingsPersistenceStore, useSettingsStore } from '@/stores/useSettingsStore';
import type { AppNotificationData } from '@/types/notification';
import {
  adiarNotificacao,
  encerrarOcorrencia,
} from '@/utils/agendar-notificacoes';
import { readNotificationData } from '@/utils/notification-data';
import { enqueueNotificationOperation } from '@/utils/notification-queue';
import { ocorrenciaDaChave } from '@/utils/notificacoes';
import { ACAO_ADIAR, ACAO_FEITO } from '@/utils/preparar-notificacoes';

type ConteudoRecebido = { data?: unknown; dataString?: string };

/** Na tarefa em segundo plano do Android os dados chegam como texto JSON em `dataString`. */
const lerDados = (notificacao: Notifications.Notification): AppNotificationData | null => {
  const conteudo = notificacao.request.content as ConteudoRecebido;
  const data = readNotificationData(conteudo.data);
  if (data) return data;
  try {
    return readNotificationData(conteudo.dataString ? JSON.parse(conteudo.dataString) : null);
  } catch {
    return null;
  }
};

const storesLoaded = async (includeSettings: boolean) => {
  for (const store of includeSettings ? [useSettingsStore, useLembretesStore] : [useLembretesStore]) {
    if (!store.persist.hasHydrated()) await store.persist.rehydrate();
    if (!store.persist.hasHydrated()) throw new Error('Não foi possível carregar os lembretes.');
  }
  if (includeSettings && useSettingsPersistenceStore.getState().operation === 'load') throw new Error('Preferências indisponíveis.');
};

export type NotificationDestination = { kind: 'exercise' } | { kind: 'reminder'; id: string };

/**
 * Trata o toque na notificação ou num botão dela. "Tomei"/"Fiz" marca o horário como feito;
 * "Lembrar em 10 min" valida preferências, item e conclusão depois de hidratar as stores.
 * Exercícios só retornam destino ao toque; ações de lembretes não se aplicam a eles.
 */
export const responderNotificacao = async (
  resposta: Notifications.NotificationResponse
): Promise<NotificationDestination | null> => {
  const notificacao = resposta.notification;
  const dados = lerDados(notificacao);
  if (!dados) return null;
  if (dados.kind === 'exercise') {
    return resposta.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER ? { kind: 'exercise' } : null;
  }

  if (resposta.actionIdentifier === ACAO_ADIAR || resposta.actionIdentifier === ACAO_FEITO) {
    return enqueueNotificationOperation(async () => {
      try {
        await storesLoaded(resposta.actionIdentifier === ACAO_ADIAR);
        const { lembretes, registros, marcarFeito } = useLembretesStore.getState();
        const occurrence = ocorrenciaDaChave(dados.ocorrencia, lembretes);
        if (resposta.actionIdentifier === ACAO_FEITO) {
          if (occurrence) marcarFeito(occurrence);
          await encerrarOcorrencia(notificacao, dados);
        } else if (useSettingsStore.getState().reminderNotificationsEnabled && occurrence?.lembrete.ativo
          && occurrence.lembrete.id === dados.lembreteId && !registros.some((record) => record.chave === dados.ocorrencia)) {
          const canSnooze = () => {
            const current = useLembretesStore.getState();
            return useSettingsStore.getState().reminderNotificationsEnabled
              && current.lembretes.some((item) => item.id === dados.lembreteId && item.ativo)
              && !current.registros.some((record) => record.chave === dados.ocorrencia);
          };
          await adiarNotificacao(notificacao, dados, canSnooze);
          if (!useSettingsStore.getState().reminderNotificationsEnabled) {
            await encerrarOcorrencia(notificacao, dados);
          }
        }
      } catch {
        useNotificationSyncStore.setState({ error: 'Não foi possível atualizar este aviso. Abra o Lembri e tente novamente.' });
      }
      return null;
    });
  }
  return { kind: 'reminder', id: dados.lembreteId };
};
