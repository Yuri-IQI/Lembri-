import { StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Mensagem de erro curta abaixo de um campo, com ícone para não depender só da cor.
 */
export const MensagemErro = ({ mensagem }: { mensagem: string }) => {
  const theme = useTheme();

  return (
    <View style={styles.linha} accessibilityLiveRegion="polite">
      <MaterialSymbol name="error" size={18} tintColor={theme.danger} />
      <ThemedText type="smallBold" style={[styles.texto, { color: theme.danger }]}>
        {mensagem}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  texto: {
    flex: 1,
  },
});
