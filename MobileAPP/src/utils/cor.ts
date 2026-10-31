import { Colors } from '@/constants/theme';
import { razaoDeContraste } from '@/utils/contraste';

const CONTRASTE_AAA = 7;
const SATURACAO = 0.75;
const LUMINOSIDADE_INICIAL = 0.72;

const paraHex = (canal: number) =>
  Math.round(canal * 255)
    .toString(16)
    .padStart(2, '0');

/** Converte HSL (matiz em graus; saturação e luminosidade de 0 a 1) para #RRGGBB. */
export const hslParaHex = (matiz: number, saturacao: number, luminosidade: number): string => {
  const a = saturacao * Math.min(luminosidade, 1 - luminosidade);
  const canal = (n: number) => {
    const k = (n + matiz / 30) % 12;
    return luminosidade - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return `#${paraHex(canal(0))}${paraHex(canal(8))}${paraHex(canal(4))}`.toUpperCase();
};

/**
 * Cor do matiz clara o bastante para o texto preto ter contraste AAA (7:1) sobre ela.
 */
export const corLegivelDoMatiz = (matiz: number): string => {
  for (let luminosidade = LUMINOSIDADE_INICIAL; luminosidade < 1; luminosidade += 0.02) {
    const cor = hslParaHex(matiz, SATURACAO, luminosidade);
    if (razaoDeContraste(Colors.text, cor) >= CONTRASTE_AAA) return cor;
  }
  return Colors.surface;
};

/** Matiz (0 a 360) de uma cor #RRGGBB. */
export const matizDaCor = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((inicio) => parseInt(hex.slice(inicio, inicio + 2), 16) / 255);
  const maior = Math.max(r, g, b);
  const diferenca = maior - Math.min(r, g, b);
  if (diferenca === 0) return 0;
  const setor =
    maior === r
      ? ((g - b) / diferenca) % 6
      : maior === g
        ? (b - r) / diferenca + 2
        : (r - g) / diferenca + 4;
  return (setor * 60 + 360) % 360;
};

/** Paradas do gradiente com todas as cores legíveis, de 0° (posição 0) a 360° (posição 1). */
export const paradasDeMatizes = (): { cor: string; posicao: number }[] =>
  Array.from({ length: 13 }, (_, i) => ({ cor: corLegivelDoMatiz(i * 30), posicao: i / 12 }));
