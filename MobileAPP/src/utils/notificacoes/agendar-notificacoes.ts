import * as Notifications from 'expo-notifications';

import type { ReminderNotificationData } from '@/types/notification';
import type { ExerciseNotification } from '@/utils/exercise-notifications';
import { isOwnedNotificationId, readNotificationData } from '@/utils/notification-data';
import {
  MINUTOS_ADIAR,
  MAXIMO_NOTIFICACOES,
  DIAS_NOTIFICACOES,
  SUFIXO_ADIADA,
  type NotificacaoLembrete,
} from '@/utils/notificacoes/notificacoes';
import { CANAL, prepararAvisos } from '@/utils/notificacoes/preparar-notificacoes';

export type DadosNotificacao = ReminderNotificationData;
export type AppNotification = NotificacaoLembrete | ExerciseNotification;
/** Até 100 lembretes (incluindo adiamentos) e 7 avisos de exercício no Android. */
export const MAX_APP_NOTIFICATIONS = MAXIMO_NOTIFICACOES + DIAS_NOTIFICACOES;

const assinatura = (n: AppNotification) =>
  `${n.quando.getTime()}|${n.titulo}|${n.corpo}|${'categoria' in n ? n.categoria ?? '' : ''}`;

const scheduledTime = (request: Notifications.NotificationRequest): number => {
  const data = readNotificationData(request.content.data);
  const signedTime = Number(data?.assinatura?.split('|')[0]);
  const localTime = request.identifier.match(/@(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/)?.[1];
  return Number.isFinite(signedTime) ? signedTime : localTime ? new Date(localTime).getTime() : 0;
};

const agendar = (identifier: string, content: Notifications.NotificationContentInput, date: Date) =>
  Notifications.scheduleNotificationAsync({
    identifier,
    content: { sound: 'default', ...content },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CANAL },
  });

/**
 * Deixa agendadas exatamente as notificações desejadas: cancela as que sobraram ou mudaram e
 * agenda as que faltam. As adiadas pelo botão ficam enquanto `manterAdiada` disser que valem.
 * Cancela avisos próprios mesmo sem permissão; nunca remove agendamentos desconhecidos.
 * Interrompe agendamentos se as preferências mudarem durante uma chamada nativa.
 */
export const sincronizarNotificacoes = async (
  desejadas: AppNotification[],
  manterAdiada: (dados: DadosNotificacao) => boolean,
  isCurrent: () => boolean = () => true,
) => {
  const permitted = (await Notifications.getPermissionsAsync()).granted;
  if (permitted) await prepararAvisos();

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const snoozed = new Set(scheduled.filter((notification) => {
    const data = readNotificationData(notification.content.data);
    return isOwnedNotificationId(notification.identifier) && notification.identifier.endsWith(SUFIXO_ADIADA)
      && data && data.kind !== 'exercise' && manterAdiada(data);
  }).slice(0, MAXIMO_NOTIFICACOES).map((notification) => notification.identifier));
  const limited = [
    ...desejadas.filter((n) => n.kind !== 'exercise').slice(0, MAXIMO_NOTIFICACOES - snoozed.size),
    ...desejadas.filter((n) => n.kind === 'exercise').slice(0, DIAS_NOTIFICACOES),
  ];
  const faltam = new Map(limited.map((n) => [n.id, n]));
  for (const agendada of scheduled) {
    const id = agendada.identifier;
    if (!isOwnedNotificationId(id)) continue;
    if (!isCurrent()) return;
    const dados = readNotificationData(agendada.content.data);
    const desejada = faltam.get(id);
    if (desejada && dados?.assinatura === assinatura(desejada)) faltam.delete(id);
    else if (!snoozed.has(id)) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  for (const n of faltam.values()) {
    if (!permitted || !isCurrent()) return;
    const exercise = n.kind === 'exercise';
    const data = exercise ? { kind: 'exercise', dateKey: n.dateKey, assinatura: assinatura(n) } : {
      kind: 'reminder',
      lembreteId: n.lembreteId,
      ocorrencia: n.ocorrencia,
      assinatura: assinatura(n),
    };
    await agendar(
      n.id,
      { title: n.titulo, body: n.corpo, data, categoryIdentifier: exercise ? undefined : n.categoria },
      n.quando
    );
    if (!isCurrent()) {
      await Notifications.cancelScheduledNotificationAsync(n.id);
      return;
    }
  }
};

export const adiarNotificacao = async (
  notificacao: Notifications.Notification,
  dados: DadosNotificacao,
  isAllowed: () => boolean = () => true,
) => {
  const { content, identifier } = notificacao.request;
  const snoozedId = `${dados.ocorrencia}${SUFIXO_ADIADA}`;
  await Notifications.dismissNotificationAsync(identifier);
  if (!isAllowed()) return;
  const reminders = (await Notifications.getAllScheduledNotificationsAsync())
    .filter((request) => isOwnedNotificationId(request.identifier) && !request.identifier.startsWith('lembri:exercise:'));
  if (reminders.length >= MAXIMO_NOTIFICACOES && !reminders.some((request) => request.identifier === snoozedId)) {
    const candidates = reminders.filter((request) => !request.identifier.endsWith(SUFIXO_ADIADA))
      .sort((a, b) => scheduledTime(b) - scheduledTime(a));
    const replace = candidates[0];
    if (!replace) throw new Error('Limite de avisos adiados atingido.');
    await Notifications.cancelScheduledNotificationAsync(replace.identifier);
  }
  if (!isAllowed()) return;
  await agendar(
    snoozedId,
    {
      title: content.title,
      body: content.body,
      data: { lembreteId: dados.lembreteId, ocorrencia: dados.ocorrencia },
      categoryIdentifier: content.categoryIdentifier ?? undefined,
    },
    new Date(Date.now() + MINUTOS_ADIAR * 60_000)
  );
  if (!isAllowed()) await Notifications.cancelScheduledNotificationAsync(snoozedId);
};

const ehDaOcorrencia = (conteudo: { data?: unknown }, ocorrencia: string) =>
  (conteudo.data as DadosNotificacao | undefined)?.ocorrencia === ocorrencia;

export const cancelarAvisosDaOcorrencia = async (ocorrencia: string) => {
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  for (const agendada of agendadas) {
    if (ehDaOcorrencia(agendada.content, ocorrencia)) {
      await Notifications.cancelScheduledNotificationAsync(agendada.identifier);
    }
  }
  for (const { request } of await Notifications.getPresentedNotificationsAsync()) {
    if (ehDaOcorrencia(request.content, ocorrencia)) {
      await Notifications.dismissNotificationAsync(request.identifier);
    }
  }
};

export const encerrarOcorrencia = async (
  notificacao: Notifications.Notification,
  { ocorrencia }: DadosNotificacao
) => {
  await Notifications.dismissNotificationAsync(notificacao.request.identifier);
  await cancelarAvisosDaOcorrencia(ocorrencia);
};
