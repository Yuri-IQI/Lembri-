import { getScaledTypography, TextScale, Typography, type TextVariant } from '@/constants/theme';
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
}
