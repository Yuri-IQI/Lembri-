import { Colors, Typography } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

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
