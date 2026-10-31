import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type RotuloCampoProps = {
  rotulo: string;
  obrigatorio?: boolean;
};

/**
 * Rótulo de campo com "(obrigatório)" no canto oposto da mesma linha.
 */
export const RotuloCampo = ({ rotulo, obrigatorio = false }: RotuloCampoProps) => (
  <View
    style={styles.linha}
    accessible
    accessibilityRole="header"
    accessibilityLabel={obrigatorio ? `${rotulo}, obrigatório` : rotulo}>
    <ThemedText type="label" style={styles.rotulo}>
      {rotulo}
    </ThemedText>
    {obrigatorio && (
      <ThemedText type="small" themeColor="danger">
        (obrigatório)
      </ThemedText>
    )}
  </View>
);

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: Spacing.two,
  },
  rotulo: {
    flexShrink: 1,
  },
});
