import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipHorarioProps = {
  horario: string;
  destacado?: boolean;
  /** Já marcado como feito hoje: fica verde, com o ícone de feito. */
  feito?: boolean;
};

export const ChipHorario = ({ horario, destacado = false, feito = false }: ChipHorarioProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: feito ? theme.success : destacado ? theme.chipSelected : theme.surface,
          borderColor: feito || destacado ? theme.primary : theme.border,
        },
      ]}
      accessible
      accessibilityLabel={feito ? `${horario}, feito hoje` : horario}>
      {feito && <SymbolView name={{ android: 'check' }} size={18} tintColor={theme.text} />}
      <ThemedText type="smallBold">{horario}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three - Spacing.one,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.hairline,
  },
});
