/**
 * Cores e espaçamentos do app (modo claro e escuro).
 * Tamanhos de texto ficam em components/themed-text.tsx.
 */
export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#60646C',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    primary: '#208AEF',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    background: '#000000',
    backgroundElement: '#212225',
    primary: '#208AEF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;
