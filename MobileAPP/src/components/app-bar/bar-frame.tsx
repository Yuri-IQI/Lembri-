import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComponentSize, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BarFrameProps = ViewProps & {
  posicao: 'top' | 'bottom';
  /** Cor de fundo; a barra superior usa o fundo da tela para não formar uma faixa. */
  fundo?: ThemeColor;
};

export const BarFrame = ({ posicao, fundo = 'surface', style, children, ...rest }: BarFrameProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={[posicao, 'left', 'right']} style={{ backgroundColor: theme[fundo] }}>
      <View style={[styles.linha, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linha: {
    minHeight: ComponentSize.barFrameHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
