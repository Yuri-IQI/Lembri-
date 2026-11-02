import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { DetalheLembrete } from '@/utils/lembrete/detalhes-lembrete';

export const ValorDetalhe = ({ valor, numerada = false }: Omit<DetalheLembrete, 'rotulo'>) => {
  if (typeof valor === 'string') return <ThemedText>{valor}</ThemedText>;

  return (
    <View style={styles.lista} accessibilityRole="list">
      {valor.map((item, indice) => (
        <ThemedText key={`${indice}-${item}`}>
          {numerada ? `${indice + 1}. ${item}` : `• ${item}`}
        </ThemedText>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  lista: {
    gap: Spacing.one,
  },
});
