import { Colors } from '@/constants/theme';

const luminancia = (hex: string): number => {
  const canais = [1, 3, 5].map((inicio) => parseInt(hex.slice(inicio, inicio + 2), 16) / 255);
  const [r, g, b] = canais.map((canal) =>
    canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const razaoDeContraste = (corA: string, corB: string): number => {
  const [clara, escura] = [luminancia(corA), luminancia(corB)].sort((a, b) => b - a);
  return (clara + 0.05) / (escura + 0.05);
};

export const corDeTextoLegivel = (fundoHex: string): string =>
  razaoDeContraste(Colors.text, fundoHex) >= razaoDeContraste(Colors.onPrimary, fundoHex)
    ? Colors.text
    : Colors.onPrimary;
