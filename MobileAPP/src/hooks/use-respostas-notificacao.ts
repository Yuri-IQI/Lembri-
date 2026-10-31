import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useLembretesStore } from '@/stores/useLembretesStore';
import { responderNotificacao } from '@/utils/responder-notificacao';

const tratar = async (resposta: Notifications.NotificationResponse) => {
  const lembreteId = await responderNotificacao(resposta);
  const existe = useLembretesStore.getState().lembretes.some((item) => item.id === lembreteId);
  if (lembreteId && existe) router.push({ pathname: '/lembrete/[id]', params: { id: lembreteId } });
};

/**
 * Tocar na notificação abre o lembrete; os botões funcionam também com o app aberto. Ao voltar
 * para o app, relê os "Fiz" que os botões salvaram enquanto ele estava fechado.
 */
export const useRespostasNotificacao = (hidratado: boolean) => {
  useEffect(() => {
    if (!hidratado) return;
    const ultima = Notifications.getLastNotificationResponse();
    if (ultima) {
      Notifications.clearLastNotificationResponse();
      tratar(ultima);
    }
    const respostas = Notifications.addNotificationResponseReceivedListener((resposta) => {
      Notifications.clearLastNotificationResponse();
      tratar(resposta);
    });
    const retorno = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') useLembretesStore.persist.rehydrate();
    });
    return () => {
      respostas.remove();
      retorno.remove();
    };
  }, [hidratado]);
};
