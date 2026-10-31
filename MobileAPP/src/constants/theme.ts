import type { TextStyle } from 'react-native';

/**
 * Paleta oficial de cores de alto contraste (WCAG 2.2 Nível AAA) extraída do protótipo do Figma.
 *
 * O tema principal do Lembri é preto no branco com detalhes em cinza e amarelo de destaque.
 * Atenção: `textMuted` (#949494) possui contraste ~3.06:1 e deve ser restrito exclusivamente
 * a placeholders de input ou elementos desabilitados (isento pela WCAG 1.4.6).
 */
export const Colors = {
  text: '#000000',
  textSecondary: '#4E4E4E',
  textMuted: '#949494',

  background: '#F2F2F2',
  surface: '#FFFFFF',

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
  chipSelected: '#CCCCCC',
  tabActive: '#DADADA',
  success: '#A8D5A2',
  overlay: 'rgba(0, 0, 0, 0.55)',
} as const;

export type ThemeColor = keyof typeof Colors;

export const FontFamily = 'Inter';

/**
 * Fatores multiplicadores para o modo padrão (1.0x) e modo "Texto ampliado" (1.2x).
 */
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
  /** Teto opcional de fontSize no modo Texto Ampliado para evitar quebra de layout. */
  maxFontSize?: number;
}

/**
 * Escala tipográfica extraída do Figma com lineHeight adequado para WCAG 2.2 AAA (>= 1.5x).
 */
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
  /** Horário em destaque no card de próximo lembrete (18:00). */
  display: {
    fontSize: 52,
    lineHeight: 62,
    fontWeight: 400,
    maxFontSize: 56,
  },
  /** Título de tela e de lembrete (Home, Lavar roupas). */
  title: {
    fontSize: 30,
    lineHeight: 45,
    fontWeight: 700,
    maxFontSize: 34,
  },
  /** Título de card de navegação (Lembretes, Exercícios). */
  headline: {
    fontSize: 26,
    lineHeight: 39,
    fontWeight: 700,
  },
  /** Título de item de lista (Tomar Remédio). */
  subheading: {
    fontSize: 22,
    lineHeight: 33,
    fontWeight: 700,
  },
  /** Informações de apoio (Há 25 min.). */
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
  /** Rótulo de seção em caixa alta (PRÓXIMO LEMBRETE, HORÁRIOS). */
  label: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  /** Texto de botão (Ver, Editar, Excluir). */
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

/**
 * Calcula os valores tipográficos escalados para o modo padrão (1.0x) ou "Texto ampliado" (1.2x),
 * respeitando o teto maxFontSize nas variantes de destaque e preservando a proporção de entrelinha.
 *
 * @param variant - Variante tipográfica do catálogo Typography.
 * @param isLargeText - Indica se o modo "Texto ampliado" está ativo.
 * @returns Objeto de estilo tipográfico pronto para aplicação em componentes Text.
 */
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

/**
 * Dimensões estruturais e áreas de toque de componentes padronizados.
 */
export const ComponentSize = {
  /** Altura mínima da barra superior (TopBar). */
  topBarHeight: 64,
  /** Altura mínima da moldura base das barras (BarFrame). */
  barFrameHeight: 72,
  /** Altura mínima da barra inferior de abas (BottomBar). */
  bottomBarHeight: 80,

  /** Dimensões estruturais do interruptor customizado (Switch). */
  switchWidth: 56,
  switchHeight: 32,
  switchKnob: 28,

  /** Diâmetro do marcador circular de conclusão (mínimo visual WCAG AAA). */
  marcadorCirculo: 44,

  /** Largura mínima da coluna de horário na listagem de lembretes. */
  horarioMinWidth: 76,

  /** Espessura da linha do texto riscado/tachado. */
  strikethroughHeight: 2,

  /** Dimensões e áreas de apoio da barra superior. */
  topBarButton: 31,
  topBarBackWidth: 40,
  topBarHitSlop: 8,
} as const;

/**
 * Fórmulas de gradientes visuais extraídas do protótipo Figma.
 */
export const Gradients = {
  /**
   * Gradiente do card de próximo lembrete na Home.
   *
   * @param feito - Indica se o lembrete foi concluído.
   * @param theme - Objeto com tokens de cor do tema.
   * @returns Declaração CSS de linear-gradient.
   */
  proximoLembrete: (
    feito: boolean,
    theme: { success: string; accent: string; surface: string }
  ) =>
    `linear-gradient(-59.4deg, ${feito ? theme.success : theme.accent} 18.9%, ${theme.surface} 114.5%)`,
} as const;
