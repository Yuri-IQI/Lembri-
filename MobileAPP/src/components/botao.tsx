import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BotaoProps = {
  rotulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  tamanho?: 'normal' | 'compacto';
  icone?: AndroidSymbol;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const Botao = ({
  rotulo,
  onPress,
  variante = 'primario',
  tamanho = 'normal',
  icone,
  accessibilityLabel,
  style,
}: BotaoProps) => {
  const theme = useTheme();
  const primario = variante === 'primario';
  const corTexto = primario ? 'onPrimary' : 'text';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? rotulo}
      style={({ pressed }) => [
        styles.botao,
        {
          backgroundColor: primario ? theme.primary : theme.surface,
          borderColor: theme.primary,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}>
      {icone && <SymbolView name={{ android: icone }} size={28} tintColor={theme[corTexto]} />}
      <ThemedText type={tamanho === 'normal' ? 'button' : 'smallBold'} themeColor={corTexto}>
        {rotulo}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botao: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thick,
  },
});
