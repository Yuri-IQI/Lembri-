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
