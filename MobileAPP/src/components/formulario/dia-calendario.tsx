import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DiaCalendarioProps = {
  dia: Date | null;
  selecionado: boolean;
  hoje: boolean;
  disponivel: boolean;
  rotulo: string;
  onEscolher: () => void;
};

/**
 * Uma casa do calendário: vazia fora do mês, desabilitada fora do intervalo permitido.
 */
export const DiaCalendario = ({
  dia,
  selecionado,
  hoje,
  disponivel,
  rotulo,
  onEscolher,
}: DiaCalendarioProps) => {
  const theme = useTheme();
  if (!dia) return <View style={styles.casa} />;

  return (
    <Pressable
      onPress={onEscolher}
      disabled={!disponivel}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: selecionado, disabled: !disponivel }}
      style={({ pressed }) => [
        styles.casa,
        styles.dia,
        {
          backgroundColor: selecionado ? theme.primary : 'transparent',
          borderColor: hoje && !selecionado ? theme.primary : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <ThemedText
        type={selecionado || hoje ? 'defaultBold' : 'default'}
        style={{
          color: selecionado ? theme.onPrimary : disponivel ? theme.text : theme.textMuted,
        }}>
        {dia.getDate()}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  casa: {
    flex: 1,
    minHeight: ComponentSize.calendarioCelula,
  },
  dia: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: BorderWidth.regular,
  },
});
