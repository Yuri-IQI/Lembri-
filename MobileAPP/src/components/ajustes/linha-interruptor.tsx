import { StyleSheet, View } from 'react-native';

import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';

type LinhaInterruptorProps = {
  titulo: string;
  descricao: string;
  ligado: boolean;
  onAlternar: () => void;
};

/**
 * Linha de ajuste com título, descrição sempre visível e interruptor à direita.
 */
export const LinhaInterruptor = ({ titulo, descricao, ligado, onAlternar }: LinhaInterruptorProps) => (
  <View style={styles.linha}>
    <View style={styles.textos}>
      <ThemedText type="subheading">{titulo}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {descricao}
      </ThemedText>
    </View>
    <Interruptor ligado={ligado} onAlternar={onAlternar} accessibilityLabel={titulo} />
  </View>
);

const styles = StyleSheet.create({
  linha: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  textos: {
    flex: 1,
  },
});
