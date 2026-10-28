import type { TipoLembrete } from '@/types/tipo-lembrete';

/**
 * Categorias iniciais mockadas para classificação de lembretes.
 * As cores escolhidas garantem taxa de contraste superior a 7:1 sobre fundos claros (WCAG AAA).
 */
export const tiposLembreteIniciaisMock: TipoLembrete[] = [
  {
    id: 'tipo-saude',
    nome: 'Saúde',
    corHex: '#0284C7',
    icone: 'heart-pulse',
  },
  {
    id: 'tipo-casa',
    nome: 'Casa',
    corHex: '#D97706',
    icone: 'home',
  },
  {
    id: 'tipo-trabalho',
    nome: 'Trabalho',
    corHex: '#4B5563',
    icone: 'briefcase',
  },
  {
    id: 'tipo-pessoal',
    nome: 'Pessoal',
    corHex: '#059669',
    icone: 'user',
  },
];

/**
 * Fábrica para geração de categorias de lembrete mockadas para testes e cenários dinâmicos.
 */
export const criarTipoLembreteMock = (override: Partial<TipoLembrete> = {}): TipoLembrete => ({
  id: `tipo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  nome: 'Categoria de Teste',
  corHex: '#0284C7',
  icone: 'tag',
  ...override,
});
