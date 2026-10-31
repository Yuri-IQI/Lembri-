import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BorderWidth, ComponentSize, Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MarcadorFeitoProps = {
  feito: boolean;
  onAlternar: () => void;
  descricao: string;
  /** Ação lida pelo leitor de tela ("Tomei" no remédio, "Fiz" nos demais). */
  rotulo?: string;
};

const CIRCULO = ComponentSize.marcadorCirculo;

export const MarcadorFeito = ({
  feito,
  onAlternar,
  descricao,
  rotulo = 'Feito',
}: MarcadorFeitoProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onAlternar}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: feito }}
      accessibilityLabel={`${rotulo}: ${descricao}`}
      style={({ pressed }) => [styles.area, { opacity: pressed ? 0.6 : 1 }]}>
      <View
        style={[
          styles.circulo,
          { backgroundColor: feito ? theme.primary : theme.surface, borderColor: theme.primary },
        ]}>
        {feito && <SymbolView name={{ android: 'check' }} size={28} tintColor={theme.onPrimary} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  area: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo: {
    width: CIRCULO,
    height: CIRCULO,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: BorderWidth.thick,
  },
});
