import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BotaoFiltroProps = {
  rotulo: string;
  selecionado: boolean;
  onPress: () => void;
};

/**
 * Aba de filtro da agenda; a selecionada fica preenchida de preto.
 */
export const BotaoFiltro = ({ rotulo, selecionado, onPress }: BotaoFiltroProps) => {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: selecionado }}
      accessibilityLabel={`Mostrar ${rotulo}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filtro,
        {
          backgroundColor: selecionado ? theme.primary : theme.surface,
          borderColor: selecionado ? theme.primary : theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <ThemedText
        type="smallBold"
        themeColor={selecionado ? 'onPrimary' : 'text'}
        style={styles.texto}>
        {rotulo}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  filtro: {
    flex: 1,
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  texto: {
    textAlign: 'center',
  },
});
