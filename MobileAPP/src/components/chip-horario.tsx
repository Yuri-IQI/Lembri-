import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipHorarioProps = {
  horario: string;
  destacado?: boolean;
};

export const ChipHorario = ({ horario, destacado = false }: ChipHorarioProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: destacado ? theme.chipSelected : theme.surface,
          borderColor: destacado ? theme.primary : theme.border,
        },
      ]}>
      <ThemedText type="smallBold">{horario}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three - Spacing.one,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
