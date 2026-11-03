import { StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const Aviso = () => {
  const theme = useTheme();
  return (
    <View style={styles.aviso}>
      <MaterialSymbol name="delete" size={28} tintColor={theme.onPrimary} />
      <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
        Excluir
      </ThemedText>
    </View>
  );
};

export const FundoExcluir = () => {
  const theme = useTheme();
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      style={[styles.fundo, { backgroundColor: theme.danger }]}>
      <Aviso />
      <Aviso />
    </View>
  );
};

const styles = StyleSheet.create({
  fundo: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
  },
  aviso: {
    alignItems: 'center',
    gap: Spacing.one,
  },
});
