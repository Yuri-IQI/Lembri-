import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundElement}
      labelStyle={{ selected: { color: theme.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="lembretes">
        <NativeTabs.Trigger.Label>Lembretes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="notifications" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="exercicios">
        <NativeTabs.Trigger.Label>Exercícios</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="psychology" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="configuracoes">
        <NativeTabs.Trigger.Label>Ajustes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
