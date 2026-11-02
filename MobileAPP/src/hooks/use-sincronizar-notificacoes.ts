import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useNotificationSyncStore } from '@/stores/useNotificationSyncStore';
import { useSettingsPersistenceStore, useSettingsStore } from '@/stores/useSettingsStore';
import { sincronizarNotificacoes } from '@/utils/agendar-notificacoes';
import { chaveData } from '@/utils/data';
import { exerciseNotifications } from '@/utils/exercise-notifications';
import { isOwnedNotificationId, readNotificationData } from '@/utils/notification-data';
import { enqueueNotificationOperation } from '@/utils/notification-queue';
import { notificacoesDesejadas } from '@/utils/notificacoes';
import { pedirPermissaoNotificacoes } from '@/utils/preparar-notificacoes';

/** Uma fila para os dois domínios; cada execução lê o snapshot mais recente já hidratado. */
export const useSincronizarNotificacoes = (hydrated: boolean) => {
  useEffect(() => {
    if (!hydrated) return;
    if (Platform.OS === 'web') {
      useNotificationSyncStore.setState({ permission: 'unsupported' });
      return;
    }
    let active = true;
    const requestSync = () => {
      void enqueueNotificationOperation(async () => {
        if (!active) return;
        useNotificationSyncStore.setState({ isSyncing: true });
        try {
          if (useSettingsPersistenceStore.getState().operation === 'load') throw new Error('Preferências indisponíveis.');
          if (![useSettingsStore, useLembretesStore, useExerciciosStore].every((store) => store.persist.hasHydrated())) return;
          const settings = useSettingsStore.getState();
          const { lembretes, registros } = useLembretesStore.getState();
          const { historico } = useExerciciosStore.getState();
          const isCurrent = () => active
            && settings.reminderNotificationsEnabled === useSettingsStore.getState().reminderNotificationsEnabled
            && settings.exerciseNotificationsEnabled === useSettingsStore.getState().exerciseNotificationsEnabled
            && lembretes === useLembretesStore.getState().lembretes
            && registros === useLembretesStore.getState().registros
            && historico === useExerciciosStore.getState().historico;
          const now = new Date();
          const completed = new Set(registros.map((record) => record.chave));
          const enabled = new Set(lembretes.filter((item) => item.ativo).map((item) => item.id));
          const desired = [
            ...(settings.reminderNotificationsEnabled ? notificacoesDesejadas(lembretes, completed, now) : []),
            ...(settings.exerciseNotificationsEnabled ? exerciseNotifications(historico, now) : []),
          ];
          const permission = desired.length ? await pedirPermissaoNotificacoes()
            : (await Notifications.getPermissionsAsync()).granted;
          await sincronizarNotificacoes(desired, (data) => settings.reminderNotificationsEnabled
            && enabled.has(data.lembreteId) && !completed.has(data.ocorrencia), isCurrent);
          if (!isCurrent()) return;
          const practicedToday = historico.some((attempt) => chaveData(new Date(attempt.dataHora)) === chaveData(now));
          for (const notification of await Notifications.getPresentedNotificationsAsync()) {
            if (!isCurrent()) return;
            if (!isOwnedNotificationId(notification.request.identifier)) continue;
            const data = readNotificationData(notification.request.content.data);
            if (data && (data.kind === 'exercise'
              ? !settings.exerciseNotificationsEnabled || practicedToday
              : !settings.reminderNotificationsEnabled)) {
              await Notifications.dismissNotificationAsync(notification.request.identifier);
            }
          }
          useNotificationSyncStore.setState({ permission: permission ? 'granted' : 'denied', error: null });
        } catch {
          useNotificationSyncStore.setState({ error: 'Não foi possível atualizar todos os avisos no celular. Tente novamente.' });
        } finally {
          useNotificationSyncStore.setState({ isSyncing: false });
        }
      });
    };
    requestSync();
    const reminders = useLembretesStore.subscribe((state, previous) => {
      if (state.lembretes !== previous.lembretes || state.registros !== previous.registros) requestSync();
    });
    const exercises = useExerciciosStore.subscribe((state, previous) => {
      if (state.historico !== previous.historico) requestSync();
    });
    const settings = useSettingsStore.subscribe((state, previous) => {
      if (state.reminderNotificationsEnabled !== previous.reminderNotificationsEnabled
        || state.exerciseNotificationsEnabled !== previous.exerciseNotificationsEnabled) requestSync();
    });
    const retry = useNotificationSyncStore.subscribe((state, previous) => {
      if (state.revision !== previous.revision) requestSync();
    });
    const persistence = useSettingsPersistenceStore.subscribe((state, previous) => {
      if (state.operation !== previous.operation) requestSync();
    });
    const hydration = [useSettingsStore, useLembretesStore, useExerciciosStore]
      .map((store) => store.persist.onFinishHydration(requestSync));
    const foreground = AppState.addEventListener('change', (state) => {
      if (state === 'active') requestSync();
    });
    return () => {
      active = false;
      reminders(); exercises(); settings(); retry(); persistence(); foreground.remove();
      hydration.forEach((unsubscribe) => unsubscribe());
    };
  }, [hydrated]);
};
