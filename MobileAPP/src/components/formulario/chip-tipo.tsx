import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { corDeTextoLegivel } from '@/utils/contraste';

type ChipTipoProps = {
  nome: string;
  corHex: string;
  onRemover: () => void;
};

/**
 * Tipo escolhido no formulário, na cor do tipo; tocar tira o tipo do lembrete.
 */
export const ChipTipo = ({ nome, corHex, onRemover }: ChipTipoProps) => {
  const theme = useTheme();
  const corTexto = corDeTextoLegivel(corHex);

  return (
    <Pressable
      onPress={onRemover}
      accessibilityRole="button"
      accessibilityLabel={`Tirar o tipo ${nome}`}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: corHex, borderColor: theme.primary, opacity: pressed ? 0.7 : 1 },
      ]}>
      <ThemedText type="defaultBold" style={{ color: corTexto }}>
        {nome}
      </ThemedText>
      <SymbolView name={{ android: 'close' }} size={22} tintColor={corTexto} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.thin,
  },
});
