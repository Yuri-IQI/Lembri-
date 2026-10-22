import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BarFrameProps = ViewProps & {
  posicao: 'top' | 'bottom';
};

export const BarFrame = ({ posicao, style, children, ...rest }: BarFrameProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={[posicao, 'left', 'right']} style={{ backgroundColor: theme.surface }}>
      <View style={[styles.linha, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linha: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
