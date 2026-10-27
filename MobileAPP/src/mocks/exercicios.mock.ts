import type { Exercicio } from '@/types/exercicio';

/**
 * Catálogo inicial mockado de exercícios cognitivos alinhado ao protótipo do Figma.
 */
export const exerciciosIniciaisMock: Exercicio[] = [
  {
    id: 'exercicio-1',
    titulo: 'Sequências',
    descricao: 'Descobrir o padrão numérico e de cores',
    streakDias: 5,
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    icone: 'grid',
  },
  {
    id: 'exercicio-2',
    titulo: 'Ordenação',
    descricao: 'Organizar itens cronologicamente',
    streakDias: 3,
    nivel: 'medio',
    duracaoEstimadaMinutos: 8,
    icone: 'list-ordered',
  },
  {
    id: 'exercicio-3',
    titulo: 'Associações',
    descricao: 'Relacionar palavras e conceitos',
    streakDias: 7,
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    icone: 'git-merge',
  },
  {
    id: 'exercicio-4',
    titulo: 'Lista de compras',
    descricao: 'Memorização de itens de supermercado',
    streakDias: 2,
    nivel: 'medio',
    duracaoEstimadaMinutos: 10,
    icone: 'shopping-cart',
  },
];

/**
 * Fábrica de exercícios mockados para testes e geração dinâmica.
 */
export const criarExercicioMock = (override: Partial<Exercicio> = {}): Exercicio => ({
  id: `exercicio-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  titulo: 'Exercício de Teste',
  descricao: 'Descrição do exercício de estímulo cognitivo',
  streakDias: 1,
  nivel: 'facil',
  duracaoEstimadaMinutos: 5,
  icone: 'star',
  ...override,
});
