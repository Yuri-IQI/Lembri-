import { Pressable, StyleSheet, View } from 'react-native';

import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InterruptorProps = {
  ligado: boolean;
  onAlternar: () => void;
  accessibilityLabel: string;
};

const LARGURA = 56;
const ALTURA = 32;
const BOLINHA = 28;

export const Interruptor = ({ ligado, onAlternar, accessibilityLabel }: InterruptorProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onAlternar}
      accessibilityRole="switch"
      accessibilityState={{ checked: ligado }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={Spacing.three}
      style={[
        styles.trilho,
        {
          backgroundColor: ligado ? theme.primary : theme.surface,
          borderColor: ligado ? theme.chipSelected : theme.border,
          alignItems: ligado ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View
        style={[
          styles.bolinha,
          { backgroundColor: ligado ? theme.surface : theme.border },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  trilho: {
    width: LARGURA,
    height: ALTURA,
    justifyContent: 'center',
    paddingHorizontal: (ALTURA - BOLINHA) / 2 - BorderWidth.thin,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.full,
  },
  bolinha: {
    width: BOLINHA - BorderWidth.thin * 2,
    height: BOLINHA - BorderWidth.thin * 2,
    borderRadius: Radius.full,
  },
});
