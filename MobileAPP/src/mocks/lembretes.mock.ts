import { DIAS_SEMANA, type Lembrete } from '@/types/lembrete';

/**
 * Massa de dados inicial alinhada ao protótipo do Figma (frames "lembretes" e "detalhe lembrete"),
 * mais um lembrete pausado para demonstrar a seção de pausados.
 */
export const lembretesIniciaisMock: Lembrete[] = [
  {
    id: 'mock-lavar-roupas',
    titulo: 'Lavar roupas',
    descricao:
      'Roupas do cesto do quarto e do banheiro. Separe claras e escuras, use o ciclo normal e não esqueça de pendurar depois.',
    horarios: ['12:00', '18:00'],
    dias: [0, 4],
    tipoId: 'tipo-tarefas-domesticas',
    ativo: true,
    criadoEm: '2026-10-27T10:00:00.000Z',
  },
  {
    id: 'mock-tomar-remedio',
    titulo: 'Tomar remédio',
    horarios: ['09:00', '18:00'],
    dias: [...DIAS_SEMANA],
    tipoId: 'tipo-saude',
    ativo: true,
    criadoEm: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 'mock-regar-plantas',
    titulo: 'Regar plantas',
    horarios: ['07:30'],
    dias: [1, 3, 5],
    tipoId: 'tipo-tarefas-domesticas',
    ativo: false,
    criadoEm: '2026-10-27T07:30:00.000Z',
  },
];

/**
 * Fábrica de mocks para gerar lembretes parametrizados.
 */
export const criarLembreteMock = (override: Partial<Lembrete> = {}): Lembrete => ({
  id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  titulo: 'Lembrete de Teste',
  horarios: ['12:00'],
  dias: [...DIAS_SEMANA],
  tipoId: 'tipo-saude',
  ativo: true,
  criadoEm: new Date().toISOString(),
  ...override,
});
