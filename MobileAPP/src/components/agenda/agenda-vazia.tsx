import { StyleSheet } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';

export const AgendaVazia = () => {
  const resetarParaMocks = useLembretesStore((state) => state.resetarParaMocks);

  return (
    <Card style={styles.vazio}>
      <ThemedText type="subheading">Nenhum lembrete</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Você pode restaurar os exemplos de demonstração a qualquer momento.
      </ThemedText>
      <Botao
        rotulo="Restaurar Exemplos"
        onPress={resetarParaMocks}
        accessibilityLabel="Restaurar lembretes de demonstração"
        style={styles.botao}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  vazio: {
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  botao: {
    alignSelf: 'stretch',
  },
});
