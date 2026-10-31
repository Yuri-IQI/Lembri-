import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipRemovivelProps = {
  texto: string;
  onRemover: () => void;
};

/**
 * Valor escolhido (horário, participante, item) com botão de remover de 56dp.
 */
export const ChipRemovivel = ({ texto, onRemover }: ChipRemovivelProps) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.chip, { backgroundColor: theme.chipSelected, borderColor: theme.primary }]}>
      <ThemedText type="defaultBold" style={styles.texto}>
        {texto}
      </ThemedText>
      <Pressable
        onPress={onRemover}
        accessibilityRole="button"
        accessibilityLabel={`Remover ${texto}`}
        style={({ pressed }) => [styles.remover, { opacity: pressed ? 0.6 : 1 }]}>
        <SymbolView name={{ android: 'close' }} size={24} tintColor={theme.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.regular,
  },
  texto: {
    flexShrink: 1,
  },
  remover: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
