/**
 * Preferências visuais e de acessibilidade do usuário no aplicativo Lembri.
 */
export interface UserSettings {
  /** Indica se o modo "Texto ampliado" (escala 1.2x) está ativo. */
  isLargeText: boolean;
  /** Indica se a tela de boas-vindas já foi vista e dispensada pelo usuário. */
  hasSeenSplash: boolean;
}
