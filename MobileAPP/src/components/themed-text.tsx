import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamily, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
  | 'default'
  | 'defaultBold'
  | 'display'
  | 'title'
  | 'headline'
  | 'subheading'
  | 'small'
  | 'smallBold'
  | 'label'
  | 'button'
  | 'link';
  themeColor?: ThemeColor;
};

export const ThemedText = ({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) => {
  const theme = useTheme();
  const color = theme[themeColor ?? (type === 'label' ? 'textSecondary' : 'text')];

  return <Text style={[{ color }, styles.base, styles[type], style]} {...rest} />;
};

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily,
  },
  default: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: 400,
  },
  defaultBold: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: 600,
  },
  /** Horário em destaque no card de próximo lembrete (18:00). */
  display: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: 400,
  },
  /** Título de tela e de lembrete (Home, Lavar roupas). */
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 700,
  },
  /** Título de card de navegação (Lembretes, Exercícios). */
  headline: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 700,
  },
  /** Título de item de lista (Tomar Remédio). */
  subheading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  /** Informações de apoio (Há 25 min.). */
  small: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 400,
  },
  smallBold: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
  /** Rótulo de seção em caixa alta (PRÓXIMO LEMBRETE, HORÁRIOS). */
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  /** Texto de botão (Ver, Editar, Excluir). */
  button: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  link: {
    fontSize: 17,
    lineHeight: 30,
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
});
