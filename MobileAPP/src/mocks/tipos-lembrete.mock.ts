import type { TipoLembrete } from '@/types/tipo-lembrete';

/**
 * Categorias iniciais do protótipo do Figma (frame "criar tipo de lembrete").
 * Texto preto sobre estas cores: Saúde 8,7:1 e Tarefas Domésticas 16:1 (WCAG AAA).
 */
export const tiposLembreteIniciaisMock: TipoLembrete[] = [
  {
    id: 'tipo-saude',
    nome: 'Saúde',
    corHex: '#FF8181',
    icone: 'heart-pulse',
  },
  {
    id: 'tipo-tarefas-domesticas',
    nome: 'Tarefas Domésticas',
    corHex: '#D5EA9B',
    icone: 'home',
  },
];

/**
 * Fábrica para geração de categorias de lembrete mockadas para testes e cenários dinâmicos.
 */
export const criarTipoLembreteMock = (override: Partial<TipoLembrete> = {}): TipoLembrete => ({
  id: `tipo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  nome: 'Categoria de Teste',
  corHex: '#D5EA9B',
  icone: 'tag',
  ...override,
});
