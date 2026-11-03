import * as Linking from 'expo-linking';
import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { CartaoAjuste } from '@/components/cartao-ajuste';
import { DialogoConfirmacao } from '@/components/feedback/dialogo-confirmacao';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNotificationSyncStore } from '@/stores/useNotificationSyncStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { NotificationPreference } from '@/types/settings';

export function NotificationSettings() {
  const theme = useTheme();
  const remindersEnabled = useSettingsStore((state) => state.reminderNotificationsEnabled);
  const exercisesEnabled = useSettingsStore((state) => state.exerciseNotificationsEnabled);
  const setPreference = useSettingsStore((state) => state.setNotificationPreference);
  const permission = useNotificationSyncStore((state) => state.permission);
  const isSyncing = useNotificationSyncStore((state) => state.isSyncing);
  const error = useNotificationSyncStore((state) => state.error);
  const retry = useNotificationSyncStore((state) => state.retry);
  const [pending, setPending] = useState<NotificationPreference | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const reminderRef = useRef<ComponentRef<typeof View>>(null);
  const exerciseRef = useRef<ComponentRef<typeof View>>(null);
  const returnFocusRef = useRef<ComponentRef<typeof View> | null>(null);
  const toggle = (key: NotificationPreference, enabled: boolean) => {
    if (enabled) {
      returnFocusRef.current = key === 'reminderNotificationsEnabled' ? reminderRef.current : exerciseRef.current;
      setPending(key);
    }
    else setPreference(key, true);
  };
  const openSettings = async () => {
    try { await Linking.openSettings(); setSettingsError(null); }
    catch { setSettingsError('Não foi possível abrir os ajustes. Abra as configurações do celular e permita as notificações do Lembri.'); }
  };
  return (
    <View style={styles.section}>
      <ThemedText type="label" accessibilityRole="header">Notificações</ThemedText>
      <CartaoAjuste titulo="Avisos de Lembretes" descricao="Receba avisos na hora dos lembretes, antecipações, reavisos e adiamentos. Desligar os avisos mantém seus lembretes salvos."
        switchRef={reminderRef} ligado={remindersEnabled} onAlternar={() => toggle('reminderNotificationsEnabled', remindersEnabled)} />
      <CartaoAjuste titulo="Avisos de Exercícios" descricao="Receba um aviso diário às 09h. Ao concluir qualquer exercício no dia, o aviso desse dia é cancelado."
        switchRef={exerciseRef} ligado={exercisesEnabled} onAlternar={() => toggle('exerciseNotificationsEnabled', exercisesEnabled)} />
      <ThemedText type="small" themeColor="textSecondary">Abra o Lembri pelo menos uma vez a cada 7 dias para renovar os avisos.</ThemedText>
      {isSyncing && <View accessibilityLiveRegion="polite" style={styles.progress}>
        <ActivityIndicator color={theme.text} /><ThemedText>Atualizando avisos…</ThemedText>
      </View>}
      {permission === 'denied' && (remindersEnabled || exercisesEnabled) && <>
        <ThemedText accessibilityLiveRegion="polite">Avisos ativados no Lembri, mas bloqueados no celular.</ThemedText>
        <Botao rotulo="Abrir ajustes do celular" variante="secundario" onPress={() => void openSettings()} />
      </>}
      {permission === 'granted' && <ThemedText type="small" themeColor="textSecondary">Notificações permitidas no celular.</ThemedText>}
      {permission === 'unsupported' && <ThemedText>Os avisos estão disponíveis no aplicativo para celular.</ThemedText>}
      {(error || settingsError) && <ThemedText accessibilityRole="alert">{error ?? settingsError}</ThemedText>}
      {error && <Botao rotulo="Tentar atualizar avisos novamente" variante="secundario" onPress={retry} ocupado={isSyncing} desabilitado={isSyncing} />}
      <DialogoConfirmacao returnFocusRef={returnFocusRef} visivel={pending !== null} titulo="Desligar avisos?"
        mensagem={pending === 'reminderNotificationsEnabled'
          ? 'Você deixará de receber avisos dos seus lembretes neste celular. Seus lembretes continuarão salvos.'
          : 'Você deixará de receber o aviso diário para praticar exercícios.'}
        rotuloCancelar="Manter avisos" descricaoCancelar="Manter os avisos ativados" rotuloConfirmar="Desligar avisos"
        onCancelar={() => setPending(null)} onConfirmar={() => {
          if (pending) setPreference(pending, false);
          setPending(null);
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  progress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
});
