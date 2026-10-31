import { Colors, Typography } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Hook que fornece os tokens de cores de alto contraste (WCAG 2.2 AAA) e o estado
 * reativo de escala tipográfica ("Texto ampliado") da `useSettingsStore`.
 *
 * Mantém todas as propriedades de `Colors` diretamente na raiz do objeto retornado
 * para retrocompatibilidade com componentes existentes (`theme.text`, `theme.surface`, etc.).
 */
export function useTheme() {
  const isLargeText = useSettingsStore((state) => state.isLargeText);
  const textScaleFactor = useSettingsStore((state) => state.textScaleFactor);

  return {
    ...Colors,
    isLargeText,
    textScaleFactor,
    typography: Typography,
  };
}
