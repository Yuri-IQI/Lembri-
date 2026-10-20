import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

/** Paleta do tema atual (segue o modo claro/escuro do sistema). */
export function useTheme() {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}
