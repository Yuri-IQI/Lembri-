import type { UserSettings } from '@/types/settings';

/**
 * Estado inicial padrão das configurações visuais do aplicativo.
 */
export const defaultSettingsMock: UserSettings = {
  isLargeText: false,
  hasSeenSplash: false,
};

/**
 * Factory para geração de estados de configuração em testes automatizados.
 *
 * @param overrides - Propriedades opcionais para sobrescrever o estado padrão.
 * @returns Objeto de configurações mesclado com os valores de teste.
 */
export function createSettingsMock(overrides?: Partial<UserSettings>): UserSettings {
  return {
    ...defaultSettingsMock,
    ...overrides,
  };
}
