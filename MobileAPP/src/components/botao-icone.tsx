import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BotaoIconeProps = Omit<PressableProps, 'children' | 'style'> & {
  icone: AndroidSymbol;
  accessibilityLabel: string;
};

export const BotaoIcone = ({ icone, ...rest }: BotaoIconeProps) => {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
      ]}
      {...rest}>
      <SymbolView name={{ android: icone }} size={32} tintColor={theme.onPrimary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botao: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
});
