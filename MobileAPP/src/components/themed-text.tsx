import { StyleSheet, Text, type TextProps } from 'react-native';

import {
  FontFamily,
  getScaledTypography,
  type TextVariant,
  type ThemeColor,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: TextVariant;
  themeColor?: ThemeColor;
};

/**
 * Componente tipográfico padronizado do Lembri com suporte automático ao tema de
 * alto contraste (WCAG 2.2 Nível AAA) e ao modo "Texto ampliado" (1.2x).
 *
 * @param style - Estilos adicionais opcionais via StyleSheet.
 * @param type - Variante tipográfica do catálogo Typography (padrão: 'default').
 * @param themeColor - Token de cor opcional do tema.
 */
export const ThemedText = ({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) => {
  const theme = useTheme();
  const color = theme[themeColor ?? (type === 'label' ? 'textSecondary' : 'text')];
  const variantStyle = getScaledTypography(type, theme.isLargeText);

  return <Text style={[{ color }, styles.base, variantStyle, style]} {...rest} />;
};

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily,
    textAlign: 'left',
  },
});
