import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { retrySettingsPersistence, useSettingsPersistenceStore } from '@/stores/useSettingsStore';

/** Feedback persistente fora das abas, inclusive quando a leitura inicial falhar. */
export function SettingsPersistenceFeedback() {
  const error = useSettingsPersistenceStore((state) => state.error);
  const [pending, setPending] = useState(false);
  if (!error) return null;
  return <Card style={styles.feedback}>
    <ThemedText accessibilityRole="alert">{error}</ThemedText>
    <Botao rotulo="Tentar salvar ou carregar preferências novamente" variante="secundario" desabilitado={pending} ocupado={pending}
      onPress={() => {
        setPending(true);
        void retrySettingsPersistence().finally(() => setPending(false));
      }} />
  </Card>;
}

const styles = StyleSheet.create({ feedback: { margin: Spacing.two, gap: Spacing.two } });
