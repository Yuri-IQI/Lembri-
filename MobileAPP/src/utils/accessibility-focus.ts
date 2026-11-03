import { AccessibilityInfo, Platform } from 'react-native';

export async function focusAccessibleElement(element: Parameters<typeof AccessibilityInfo.sendAccessibilityEvent>[0] | null) {
  if (!element || Platform.OS === 'web') return;
  try {
    if (await AccessibilityInfo.isScreenReaderEnabled()) AccessibilityInfo.sendAccessibilityEvent(element, 'focus');
  } catch {
    // O elemento pode ser desmontado enquanto a plataforma consulta o leitor de tela.
  }
}
