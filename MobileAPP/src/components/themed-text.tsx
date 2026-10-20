import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = type === 'link' ? theme.primary : theme[themeColor ?? 'text'];

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

// Tamanhos generosos: o público do Lembri são idosos.
const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 500,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
  },
  small: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 600,
  },
});
