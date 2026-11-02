import {
  BorderWidth,
  Colors,
  ComponentSize,
  getScaledTypography,
  TextScale,
  Typography,
  type TextVariant,
} from '@/constants/theme';
import { createSettingsMock, defaultSettingsMock } from '@/mocks/settings.mock';
import { useSettingsStore } from '@/stores/useSettingsStore';

if (typeof globalThis.window === 'undefined') {
  const memoryStore = new Map<string, string>();
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: {
      getItem: (key: string) => memoryStore.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memoryStore.set(key, value);
      },
      removeItem: (key: string) => {
        memoryStore.delete(key);
      },
      clear: () => {
        memoryStore.clear();
      },
      key: (index: number) => Array.from(memoryStore.keys())[index] ?? null,
      get length() {
        return memoryStore.size;
      },
    },
  };
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: esperado ${String(expected)}, recebido ${String(actual)}`);
  }
}

function assertOk(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function runSettingsStoreTests(): void {
  useSettingsStore.setState({
    ...defaultSettingsMock,
    textScaleFactor: TextScale.normal,
  });
  let state = useSettingsStore.getState();
  assertEqual(state.isLargeText, false, 'Estado inicial de isLargeText');
  assertEqual(state.hasSeenSplash, false, 'Estado inicial de hasSeenSplash');
  assertEqual(state.textScaleFactor, TextScale.normal, 'Estado inicial de textScaleFactor');

  useSettingsStore.getState().markSplashSeen();
  state = useSettingsStore.getState();
  assertEqual(state.hasSeenSplash, true, 'markSplashSeen deve definir hasSeenSplash como true');

  useSettingsStore.getState().markSplashSeen();
  state = useSettingsStore.getState();
  assertEqual(state.hasSeenSplash, true, 'markSplashSeen deve ser idempotente');

  useSettingsStore.getState().toggleLargeText();
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, true, 'Primeiro toggleLargeText deve ativar isLargeText');
  assertEqual(
    state.textScaleFactor,
    TextScale.large,
    'Primeiro toggleLargeText deve aplicar escala 1.2x'
  );

  useSettingsStore.getState().toggleLargeText();
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, false, 'Segundo toggleLargeText deve desativar isLargeText');
  assertEqual(
    state.textScaleFactor,
    TextScale.normal,
    'Segundo toggleLargeText deve restaurar escala 1.0x'
  );

  useSettingsStore.getState().setLargeText(true);
  useSettingsStore.getState().setLargeText(true);
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, true, 'setLargeText(true) idempotente');
  assertEqual(state.textScaleFactor, TextScale.large, 'textScaleFactor em setLargeText(true)');

  useSettingsStore.getState().setLargeText(false);
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, false, 'setLargeText(false)');
  assertEqual(state.textScaleFactor, TextScale.normal, 'textScaleFactor em setLargeText(false)');

  useSettingsStore.getState().setLargeText(true);
  useSettingsStore.getState().resetToDefaults();
  state = useSettingsStore.getState();
  assertEqual(
    state.isLargeText,
    defaultSettingsMock.isLargeText,
    'resetToDefaults deve restaurar isLargeText'
  );
  assertEqual(
    state.hasSeenSplash,
    true,
    'resetToDefaults deve preservar hasSeenSplash (R10)'
  );

  const customMock = createSettingsMock({ isLargeText: true, hasSeenSplash: true });
  assertEqual(customMock.isLargeText, true, 'createSettingsMock com isLargeText override');
  assertEqual(customMock.hasSeenSplash, true, 'createSettingsMock com hasSeenSplash override');
  assertEqual(defaultSettingsMock.isLargeText, false, 'defaultSettingsMock permanece imutável');
  assertEqual(defaultSettingsMock.hasSeenSplash, false, 'defaultSettingsMock.hasSeenSplash permanece false');

  const normalDefault = getScaledTypography('default', false);
  assertEqual(normalDefault.fontSize, 19, 'default normal fontSize');
  assertEqual(normalDefault.lineHeight, 29, 'default normal lineHeight');

  const largeDefault = getScaledTypography('default', true);
  assertEqual(largeDefault.fontSize, 23, 'default ampliado fontSize');
  assertEqual(largeDefault.lineHeight, 35, 'default ampliado lineHeight');

  const largeDisplay = getScaledTypography('display', true);
  assertEqual(largeDisplay.fontSize, 56, 'display ampliado respeita teto maxFontSize: 56');
  assertEqual(largeDisplay.lineHeight, 67, 'display ampliado lineHeight proporcional');

  const largeTitle = getScaledTypography('title', true);
  assertEqual(largeTitle.fontSize, 34, 'title ampliado respeita teto maxFontSize: 34');
  assertEqual(largeTitle.lineHeight, 51, 'title ampliado lineHeight proporcional');

  const readingVariants: TextVariant[] = [
    'default',
    'defaultBold',
    'title',
    'headline',
    'subheading',
    'small',
    'smallBold',
    'label',
    'button',
    'link',
  ];

  for (const variant of readingVariants) {
    const token = Typography[variant];
    assertOk(
      token.lineHeight / token.fontSize >= 1.5,
      `Variante ${variant} base deve ter lineHeight >= 1.5x`
    );

    const scaled = getScaledTypography(variant, true);
    assertOk(
      (scaled.lineHeight ?? 0) / (scaled.fontSize ?? 1) >= 1.5,
      `Variante ${variant} ampliada deve ter lineHeight >= 1.5x`
    );
  }

  assertEqual(BorderWidth.hairline, 1, 'BorderWidth.hairline deve ser 1');
  assertEqual(BorderWidth.thin, 1.5, 'BorderWidth.thin deve ser 1.5');
  assertEqual(BorderWidth.regular, 2, 'BorderWidth.regular deve ser 2');
  assertEqual(BorderWidth.thick, 2.5, 'BorderWidth.thick deve ser 2.5');

  assertEqual(Colors.tagSaude, '#FF8181', 'Colors.tagSaude deve corresponder à cor do Figma');
  assertEqual(ComponentSize.topBarHeight, 64, 'ComponentSize.topBarHeight');
  assertEqual(ComponentSize.barFrameHeight, 72, 'ComponentSize.barFrameHeight');
  assertEqual(ComponentSize.bottomBarHeight, 80, 'ComponentSize.bottomBarHeight');
  assertEqual(ComponentSize.marcadorCirculo, 44, 'ComponentSize.marcadorCirculo (WCAG AAA)');
  assertEqual(ComponentSize.switchWidth, 56, 'ComponentSize.switchWidth');
}
