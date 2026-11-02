import type { TextStyle } from 'react-native';

/**
 * Aviso: `textMuted` (#949494) possui contraste ~3.06:1 e deve ser restrito exclusivamente
 * a placeholders de input ou elementos desabilitados (isento pela WCAG 1.4.6).
 */
export const Colors = {
  text: '#000000',
  textSecondary: '#4E4E4E',
  textMuted: '#949494',

  background: '#F2F2F2',
  surface: '#FFFFFF',
  inputBackground: '#F9F9F9',

  border: '#949494',
  borderSubtle: '#D0D0D0',
  divider: '#D2D2D2',

  primary: '#000000',
  onPrimary: '#FFFFFF',

  accent: '#EAE28A',
  accentLight: '#F7F4DA',
  brand: '#1A1A1A',

  tag: '#D5EA9B',
  tagSaude: '#FF8181',
  tagAzul: '#9FD3F5',
  tagLilas: '#CDB8F5',
  tagLaranja: '#FFB870',
  chipSelected: '#CCCCCC',
  chipBackground: '#fcfcfc',
  borderDashed: '#292626',
  tabActive: '#F8EB5C',
  success: '#A8D5A2',
  answerCorrect: '#ECF3D9',
  answerWrong: '#F3D9D9',
  danger: '#A50E0E',
  overlay: 'rgba(0, 0, 0, 0.55)',

  loadingFundo: '#FAF7EC',
  loadingLua: '#E8E08A',
  loadingSombra: '#1B1B1B',
  loadingPonto: '#7E7E7E',
  loadingTexto: '#4A4A4A',
} as const;

export const PaletaTipos = [
  { nome: 'Vermelho', corHex: Colors.tagSaude },
  { nome: 'Verde', corHex: Colors.tag },
  { nome: 'Amarelo', corHex: Colors.accent },
  { nome: 'Azul', corHex: Colors.tagAzul },
  { nome: 'Lilás', corHex: Colors.tagLilas },
  { nome: 'Laranja', corHex: Colors.tagLaranja },
] as const;

export type ThemeColor = keyof typeof Colors;

export const FontFamily = 'Inter';

const ESCALA_LOADING = 240 / 1024;

export const LoadingEclipse = {
  arte: 240,
  lua: 660 * ESCALA_LOADING,
  luaInicio: 182 * ESCALA_LOADING,
  deslocamentoSombra: 120 * ESCALA_LOADING,
  ponto: 88 * ESCALA_LOADING,
  pontoEsquerda: 816 * ESCALA_LOADING,
  pontoTopo: 836 * ESCALA_LOADING,
  opacidadePonto: 0.3,
  fonteMarca: 'EBGaramond',
  tamanhoMarca: 44,
  alturaMarca: 52,
  espacoMarca: 2,
  espacoConteudo: 40,
  movimentoMs: 1350,
  pausaMs: 300,
  pulsoMs: 1500,
  tempoMinimoMs: 2500,
} as const;

export const TextScale = {
  normal: 1,
  large: 1.2,
} as const;

export type TextVariant =
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

export interface TypographyToken {
  fontSize: number;
  lineHeight: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
  textDecorationLine?: TextStyle['textDecorationLine'];
  maxFontSize?: number;
}

export const Typography: Record<TextVariant, TypographyToken> = {
  default: {
    fontSize: 19,
    lineHeight: 29,
    fontWeight: 400,
  },
  defaultBold: {
    fontSize: 19,
    lineHeight: 29,
    fontWeight: 600,
  },
  display: {
    fontSize: 52,
    lineHeight: 62,
    fontWeight: 400,
    maxFontSize: 56,
  },
  title: {
    fontSize: 30,
    lineHeight: 45,
    fontWeight: 700,
    maxFontSize: 34,
  },
  headline: {
    fontSize: 26,
    lineHeight: 39,
    fontWeight: 700,
  },
  subheading: {
    fontSize: 22,
    lineHeight: 33,
    fontWeight: 700,
  },
  small: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: 400,
  },
  smallBold: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: 700,
  },
  label: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 22,
    lineHeight: 33,
    fontWeight: 700,
  },
  link: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
};

export function getScaledTypography(variant: TextVariant, isLargeText: boolean): TextStyle {
  const token = Typography[variant];
  const scale = isLargeText ? TextScale.large : TextScale.normal;

  const rawFontSize = Math.round(token.fontSize * scale);
  const fontSize =
    isLargeText && token.maxFontSize ? Math.min(rawFontSize, token.maxFontSize) : rawFontSize;

  const lineHeightRatio = token.lineHeight / token.fontSize;
  const lineHeight = Math.round(fontSize * lineHeightRatio);

  return {
    fontSize,
    lineHeight,
    fontWeight: token.fontWeight,
    ...(token.letterSpacing !== undefined ? { letterSpacing: token.letterSpacing } : {}),
    ...(token.textTransform !== undefined ? { textTransform: token.textTransform } : {}),
    ...(token.textDecorationLine !== undefined
      ? { textDecorationLine: token.textDecorationLine }
      : {}),
  };
}

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const BorderWidth = {
  hairline: 1,
  thin: 1.5,
  regular: 2,
  thick: 2.5,
} as const;

export const TouchTarget = 56;

export const ComponentSize = {
  topBarHeight: 64,
  barFrameHeight: 72,
  bottomBarHeight: 80,

  switchWidth: 56,
  switchHeight: 32,
  switchKnob: 28,

  marcadorCirculo: 44,

  horarioMinWidth: 76,
  horarioDigitos: 64,

  splashLogoMax: 400,

  calendarioCelula: 44,

  chipMarcavel: 48,

  iconeTemplate: 56,
  iconeTemplateCard: 40,
  bolinhaTipo: 24,

  faixaMatiz: 48,
  marcadorMatiz: 16,

  strikethroughHeight: 2,

  medidorVozAltura: 40,
  medidorVozBarra: 12,

  topBarButton: 31,
  topBarBackWidth: 40,
} as const;

export const Gradients = {
  proximoLembrete: (feito: boolean, theme: { success: string; accent: string; surface: string }) =>
    `linear-gradient(-59.4deg, ${feito ? theme.success : theme.accent} 18.9%, ${theme.surface} 114.5%)`,
} as const;
