import { LabelTextFitting } from '@/constants/theme';

export interface MeasuredWord {
  text: string;
  width: number;
}

/** Aproxima as letras somente quando uma palavra excede a largura, sem reduzir a fonte. */
export function fitWordSpacing(words: readonly MeasuredWord[], availableWidth: number, fontSize: number): number {
  if (availableWidth <= 0 || fontSize <= 0) return 0;

  const required = words.reduce((spacing, word) => {
    if (word.width <= availableWidth) return spacing;
    const gaps = Math.max(1, Array.from(word.text).length - 1);
    return Math.min(spacing, (availableWidth - LabelTextFitting.roundingInset - word.width) / gaps);
  }, 0);

  return Math.max(-fontSize * LabelTextFitting.maximumCompressionEm, required);
}
