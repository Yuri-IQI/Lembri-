import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BARRAS = [0.2, 0.4, 0.6, 0.8, 1];

type FalaAoVivoProps = {
  texto: string;
  volume: number;
};

export const FalaAoVivo = ({ texto, volume }: FalaAoVivoProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.caixa, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <View style={styles.medidor} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {BARRAS.map((nivel) => (
          <View
            key={nivel}
            style={[
              styles.barra,
              {
                height: `${nivel * 100}%`,
                backgroundColor: volume >= nivel ? theme.primary : theme.borderSubtle,
              },
            ]}
          />
        ))}
      </View>
      <ThemedText type="label">VOCÊ ESTÁ DIZENDO</ThemedText>
      <ThemedText
        type="subheading"
        themeColor={texto ? 'text' : 'textSecondary'}
        accessibilityLiveRegion="polite">
        {texto || 'Pode falar...'}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  caixa: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
  medidor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
    height: ComponentSize.medidorVozAltura,
  },
  barra: {
    width: ComponentSize.medidorVozBarra,
    borderRadius: Radius.sm,
  },
});
