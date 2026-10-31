import * as Notifications from 'expo-notifications';

import {
  MINUTOS_ADIAR,
  SUFIXO_ADIADA,
  SUFIXO_REAVISO,
  type NotificacaoLembrete,
} from '@/utils/notificacoes';
import { CANAL, prepararAvisos } from '@/utils/preparar-notificacoes';

export type DadosNotificacao = { lembreteId: string; ocorrencia: string; assinatura?: string };

const assinatura = (n: NotificacaoLembrete) =>
  `${n.quando.getTime()}|${n.titulo}|${n.corpo}|${n.categoria ?? ''}`;

const agendar = (identifier: string, content: Notifications.NotificationContentInput, date: Date) =>
  Notifications.scheduleNotificationAsync({
    identifier,
    content: { sound: 'default', ...content },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CANAL },
  });

/**
 * Deixa agendadas exatamente as notificações desejadas: cancela as que sobraram ou mudaram e
 * agenda as que faltam. As adiadas pelo botão ficam enquanto `manterAdiada` disser que valem.
 * Sem permissão, não faz nada.
 */
export const sincronizarNotificacoes = async (
  desejadas: NotificacaoLembrete[],
  manterAdiada: (dados: DadosNotificacao) => boolean
) => {
  if (!(await Notifications.getPermissionsAsync()).granted) return;
  await prepararAvisos();

  const faltam = new Map(desejadas.map((n) => [n.id, n]));
  for (const agendada of await Notifications.getAllScheduledNotificationsAsync()) {
    const id = agendada.identifier;
    const dados = agendada.content.data as DadosNotificacao;
    const desejada = faltam.get(id);
    if (desejada && dados?.assinatura === assinatura(desejada)) faltam.delete(id);
    else if (!(id.endsWith(SUFIXO_ADIADA) && manterAdiada(dados))) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  for (const n of faltam.values()) {
    const data: DadosNotificacao = {
      lembreteId: n.lembreteId,
      ocorrencia: n.ocorrencia,
      assinatura: assinatura(n),
    };
    await agendar(
      n.id,
      { title: n.titulo, body: n.corpo, data, categoryIdentifier: n.categoria },
      n.quando
    );
  }
};

/** "Lembrar em 10 min": tira a notificação da tela e mostra de novo daqui a pouco. */
export const adiarNotificacao = async (
  notificacao: Notifications.Notification,
  dados: DadosNotificacao
) => {
  const { content, identifier } = notificacao.request;
  await Notifications.dismissNotificationAsync(identifier);
  await agendar(
    `${dados.ocorrencia}${SUFIXO_ADIADA}`,
    {
      title: content.title,
      body: content.body,
      data: { lembreteId: dados.lembreteId, ocorrencia: dados.ocorrencia },
      categoryIdentifier: content.categoryIdentifier ?? undefined,
    },
    new Date(Date.now() + MINUTOS_ADIAR * 60_000)
  );
};

/** Depois do "Tomei"/"Fiz": tira da tela e cancela o que ainda viria para esse horário. */
export const encerrarOcorrencia = async (
  notificacao: Notifications.Notification,
  { ocorrencia }: DadosNotificacao
) => {
  await Notifications.dismissNotificationAsync(notificacao.request.identifier);
  await Notifications.cancelScheduledNotificationAsync(`${ocorrencia}${SUFIXO_REAVISO}`);
  await Notifications.cancelScheduledNotificationAsync(`${ocorrencia}${SUFIXO_ADIADA}`);
};
