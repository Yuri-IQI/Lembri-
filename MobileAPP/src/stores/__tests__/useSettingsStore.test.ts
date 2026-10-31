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

/**
 * Valida igualdade estrita entre o valor obtido e o esperado nos testes unitários.
 *
 * @param actual - Valor produzido na execução.
 * @param expected - Valor esperado pelo contrato.
 * @param message - Descrição da asserção em caso de falha.
 */
function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: esperado ${String(expected)}, recebido ${String(actual)}`);
  }
}

/**
 * Valida uma condição booleana nos testes unitários.
 *
 * @param condition - Expressão booleana avaliada.
 * @param message - Descrição da asserção em caso de falha.
 */
function assertOk(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Executa a suíte de testes unitários da `useSettingsStore` e do cálculo de escala
 * tipográfica (`getScaledTypography`) conforme especificado na Seção 9.1 do SDD do CARD-22.
 */
export function runSettingsStoreTests(): void {
  // 1. Inicialização da useSettingsStore
  useSettingsStore.getState().resetToDefaults();
  let state = useSettingsStore.getState();
  assertEqual(state.isLargeText, false, 'Estado inicial de isLargeText');
  assertEqual(state.textScaleFactor, TextScale.normal, 'Estado inicial de textScaleFactor');

  // 2. Alternância imutável via toggleLargeText()
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

  // 3. Atribuição explícita e idempotente via setLargeText()
  useSettingsStore.getState().setLargeText(true);
  useSettingsStore.getState().setLargeText(true);
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, true, 'setLargeText(true) idempotente');
  assertEqual(state.textScaleFactor, TextScale.large, 'textScaleFactor em setLargeText(true)');

  useSettingsStore.getState().setLargeText(false);
  state = useSettingsStore.getState();
  assertEqual(state.isLargeText, false, 'setLargeText(false)');
  assertEqual(state.textScaleFactor, TextScale.normal, 'textScaleFactor em setLargeText(false)');

  // 4. Reset via resetToDefaults() e factory createSettingsMock()
  useSettingsStore.getState().setLargeText(true);
  useSettingsStore.getState().resetToDefaults();
  state = useSettingsStore.getState();
  assertEqual(
    state.isLargeText,
    defaultSettingsMock.isLargeText,
    'resetToDefaults deve restaurar defaultSettingsMock'
  );

  const customMock = createSettingsMock({ isLargeText: true });
  assertEqual(customMock.isLargeText, true, 'createSettingsMock com override');
  assertEqual(defaultSettingsMock.isLargeText, false, 'defaultSettingsMock permanece imutável');

  // 5. Cálculo de getScaledTypography(variant, isLargeText)
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

  // 6. Conformidade WCAG 1.4.8 AAA: lineHeight >= 1.5x em todas as variantes de leitura
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

  // 7. Tokens estruturais e bordas consolidadas
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
