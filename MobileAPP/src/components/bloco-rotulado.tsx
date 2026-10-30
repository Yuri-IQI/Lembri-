import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Spacing } from '@/constants/theme';

type BlocoRotuladoProps = {
  rotulo: string;
  children: ReactNode;
};

export const BlocoRotulado = ({ rotulo, children }: BlocoRotuladoProps) => (
  <Card style={styles.bloco} accessible>
    <ThemedText type="label" themeColor="textSecondary">
      {rotulo}
    </ThemedText>
    {children}
  </Card>
);

const styles = StyleSheet.create({
  bloco: {
    gap: Spacing.two,
    padding: Spacing.three - Spacing.one,
    borderWidth: BorderWidth.thick - 0.5,
  },
});
