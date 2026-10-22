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
  chipSelected: '#CCCCCC',
  tabActive: '#DADADA',
} as const;

export type ThemeColor = keyof typeof Colors;

export const FontFamily = 'Inter';

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
  thin: 1.5,
  thick: 2.5,
} as const;

export const TouchTarget = 56;
