import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const Aviso = () => {
  const theme = useTheme();
  return (
    <View style={styles.aviso}>
      <SymbolView name={{ android: 'delete' }} size={28} tintColor={theme.onPrimary} />
      <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
        Excluir
      </ThemedText>
    </View>
  );
};

/**
 * Fundo vermelho revelado ao arrastar o card para excluir, dos dois lados.
 */
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
