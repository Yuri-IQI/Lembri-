import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDevicesStore } from '@/stores/useDevicesStore';
import type { SimulatedDevice } from '@/types/device';

/** Mostra conexões de demonstração sem produzir operações de pareamento no hardware. */
export function DeviceSection() {
  const theme = useTheme();
  const devices = useDevicesStore((state) => state.devices);
  const loaded = useDevicesStore((state) => state.loaded);
  const isLoading = useDevicesStore((state) => state.isLoading);
  const pendingId = useDevicesStore((state) => state.pendingDeviceId);
  const error = useDevicesStore((state) => state.error);
  const load = useDevicesStore((state) => state.load);
  const setConnected = useDevicesStore((state) => state.setConnected);
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState<SimulatedDevice | null>(null);
  const controls = useRef(new Map<string, ComponentRef<typeof View>>());
  const returnFocusRef = useRef<ComponentRef<typeof View> | null>(null);
  const [retryOperation, setRetryOperation] = useState<{ id: string; connected: boolean } | null>(null);
  const changeConnection = (id: string, connected: boolean) => {
    setRetryOperation({ id, connected });
    void setConnected(id, connected);
  };
  return (
    <View style={styles.section}>
      <ThemedText type="label" accessibilityRole="header">Dispositivos</ThemedText>
      <Card style={styles.section}>
        <Pressable accessibilityRole="button" accessibilityLabel="Relógios de demonstração"
          accessibilityHint="Mostra ou oculta os relógios simulados" accessibilityState={{ expanded }}
          style={styles.trigger} onPress={() => {
            setExpanded(!expanded);
            if (!expanded && !loaded) void load();
          }}>
          <ThemedText type="subheading">Relógios de demonstração {expanded ? '−' : '+'}</ThemedText>
        </Pressable>
        {expanded && <>
          <ThemedText themeColor="textSecondary">As conexões abaixo são simuladas. Elas não alteram a conexão real com seu relógio.</ThemedText>
          {isLoading && <View accessibilityLiveRegion="polite"><ActivityIndicator color={theme.text} /><ThemedText>Carregando relógios…</ThemedText></View>}
          {loaded && !isLoading && devices.length === 0 && <>
            <ThemedText>Nenhum relógio disponível.</ThemedText>
            <Botao rotulo="Procurar relógios novamente" variante="secundario" onPress={() => void load()} />
          </>}
          {devices.map((device) => <View key={device.id} style={styles.device}>
            <ThemedText type="subheading">{device.name}</ThemedText>
            <ThemedText themeColor="textSecondary">{device.model}</ThemedText>
            <ThemedText accessibilityLiveRegion="polite">{device.status === 'connected' ? 'Conectado' : 'Desconectado'}</ThemedText>
            {pendingId === device.id && <ThemedText accessibilityLiveRegion="polite">Atualizando conexão…</ThemedText>}
            <Botao rotulo={device.status === 'connected' ? 'Desconectar' : 'Conectar'}
              controlRef={(control) => { if (control) controls.current.set(device.id, control); else controls.current.delete(device.id); }}
              accessibilityLabel={`${device.status === 'connected' ? 'Desconectar' : 'Conectar'} ${device.name}, ${device.model}, demonstração`}
              variante="secundario" ocupado={pendingId === device.id} desabilitado={pendingId !== null || isLoading} onPress={() => {
                if (device.status === 'connected') {
                  returnFocusRef.current = controls.current.get(device.id) ?? null;
                  setPending(device);
                }
                else changeConnection(device.id, true);
              }} />
          </View>)}
          {error && <>
            <ThemedText accessibilityRole="alert">{error}</ThemedText>
            <Botao rotulo="Tentar operação dos relógios novamente" variante="secundario" desabilitado={pendingId !== null || isLoading}
              onPress={() => retryOperation ? changeConnection(retryOperation.id, retryOperation.connected) : void load()} />
          </>}
        </>}
      </Card>
      <DialogoConfirmacao returnFocusRef={returnFocusRef} visivel={pending !== null} titulo="Desconectar relógio?"
        mensagem={`Deseja desconectar ${pending?.name ?? ''}, ${pending?.model ?? ''}? Esta conexão é apenas de demonstração. Você poderá conectar novamente.`}
        rotuloConfirmar="Desconectar relógio" rotuloCancelar="Manter conexão" descricaoCancelar="Cancelar e manter a conexão de demonstração"
        onCancelar={() => setPending(null)} onConfirmar={() => {
          if (pending) changeConnection(pending.id, false);
          setPending(null);
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.two },
  trigger: { minHeight: TouchTarget, minWidth: TouchTarget, justifyContent: 'center' },
  device: { gap: Spacing.two, paddingTop: Spacing.three },
});
