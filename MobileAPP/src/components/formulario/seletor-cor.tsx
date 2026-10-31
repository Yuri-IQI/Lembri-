import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  BorderWidth,
  PaletaTipos,
  Radius,
  Spacing,
  TouchTarget,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { corDeTextoLegivel } from '@/utils/contraste';

export type SeletorCorProps = {
  rotulo: string;
  valor: string;
  onAlterar: (corHex: string) => void;
};

/**
 * Seletor de cores acessível com alto contraste para categorias e tipos de lembrete (CARD-26).
 *
 * Características de acessibilidade WCAG 2.2 AAA:
 * - Círculos tocáveis com dimensão mínima TouchTarget = 56dp (Critério 2.5.5);
 * - Paleta estritamente auditada com contraste >= 7:1 contra o texto principal (Critério 1.4.6);
 * - Indicador de check com corDeTextoLegivel para não depender somente da cor (Critério 1.4.1);
 * - Papel semântico accessibilityRole="radio" com anúncio do nome da cor.
 */
export const SeletorCor = ({ rotulo, valor, onAlterar }: SeletorCorProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {rotulo ? <ThemedText type="label">{rotulo}</ThemedText> : null}

      <View style={styles.gradeCores}>
        {PaletaTipos.map((cor) => {
          const selecionado = valor.toLowerCase() === cor.corHex.toLowerCase();
          const corIcone = corDeTextoLegivel(cor.corHex);

          return (
            <Pressable
              key={cor.corHex}
              onPress={() => onAlterar(cor.corHex)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionado }}
              accessibilityLabel={`Cor ${cor.nome}`}
              style={({ pressed }) => [
                styles.circulo,
                {
                  backgroundColor: cor.corHex,
                  borderColor: selecionado ? theme.primary : theme.border,
                  borderWidth: selecionado ? BorderWidth.thick : BorderWidth.regular,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              {selecionado && (
                <SymbolView name={{ android: 'check' }} size={26} tintColor={corIcone} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  gradeCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  circulo: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
});
