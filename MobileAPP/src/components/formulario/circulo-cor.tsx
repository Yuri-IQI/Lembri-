import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { BorderWidth, Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { corDeTextoLegivel } from '@/utils/contraste';

type CirculoCorProps = {
  corHex: string;
  nome: string;
  selecionado: boolean;
  onPress: () => void;
};

/**
 * Opção de cor redonda de 56dp; a selecionada ganha borda grossa e check legível sobre a cor.
 */
export const CirculoCor = ({ corHex, nome, selecionado, onPress }: CirculoCorProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: selecionado }}
      accessibilityLabel={`Cor ${nome}`}
      style={({ pressed }) => [
        styles.circulo,
        {
          backgroundColor: corHex,
          borderColor: selecionado ? theme.primary : theme.border,
          borderWidth: selecionado ? BorderWidth.thick : BorderWidth.regular,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      {selecionado && (
        <SymbolView name={{ android: 'check' }} size={26} tintColor={corDeTextoLegivel(corHex)} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circulo: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
});
