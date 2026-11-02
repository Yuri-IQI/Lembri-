import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GrupoCardProps = {
  titulo: string;
  children: ReactNode;
};

/**
 * Seção com rótulo e um card único, com um divisor entre as linhas (Figma de Ajustes e Ajuda).
 */
export const GrupoCard = ({ titulo, children }: GrupoCardProps) => {
  const theme = useTheme();

  return (
    <View style={styles.grupo}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        {titulo}
      </ThemedText>
      <Card style={styles.card}>
        {Children.toArray(children).map((linha, index) => (
          <View
            key={index}
            style={index > 0 && [styles.divisor, { borderTopColor: theme.border }]}>
            {linha}
          </View>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  grupo: {
    gap: Spacing.two,
  },
  card: {
    gap: 0,
    padding: 0,
  },
  divisor: {
    borderTopWidth: BorderWidth.hairline,
  },
});
