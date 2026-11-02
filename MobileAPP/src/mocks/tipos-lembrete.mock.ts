import { Colors } from '@/constants/theme';
import type { TipoLembrete } from '@/types/tipo-lembrete';

export const tiposLembreteIniciaisMock: TipoLembrete[] = [
  {
    id: 'tipo-saude',
    nome: 'Saúde',
    corHex: Colors.tagSaude,
    icone: 'heart-pulse',
  },
  {
    id: 'tipo-tarefas-domesticas',
    nome: 'Tarefas Domésticas',
    corHex: Colors.tag,
    icone: 'home',
  },
];

export const criarTipoLembreteMock = (override: Partial<TipoLembrete> = {}): TipoLembrete => ({
  id: `tipo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  nome: 'Categoria de Teste',
  corHex: Colors.tag,
  icone: 'tag',
  ...override,
});
