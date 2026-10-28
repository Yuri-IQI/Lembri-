import type { Lembrete } from '@/types/lembrete';

/**
 * Massa de dados inicial mockada alinhada ao protótipo do Figma.
 * Contém itens pendentes e concluídos (inclusive com flag do Wear OS).
 */
export const lembretesIniciaisMock: Lembrete[] = [
  {
    id: 'mock-1',
    titulo: 'Tomar remédio',
    horario: '08:00',
    tipoId: 'tipo-saude',
    concluido: true,
    concluidoNoWear: true,
    criadoEm: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 'mock-2',
    titulo: 'Lavar roupas',
    horario: '10:30',
    tipoId: 'tipo-casa',
    concluido: false,
    criadoEm: '2026-10-27T10:30:00.000Z',
  },
  {
    id: 'mock-3',
    titulo: 'Beber 500ml de água',
    horario: '14:00',
    tipoId: 'tipo-saude',
    concluido: false,
    criadoEm: '2026-10-27T14:00:00.000Z',
  },
  {
    id: 'mock-4',
    titulo: 'Pagar conta de energia',
    horario: '16:00',
    tipoId: 'tipo-pessoal',
    concluido: false,
    criadoEm: '2026-10-27T16:00:00.000Z',
  },
];

/**
 * Fábrica de mocks para gerar lembretes parametrizados.
 */
export const criarLembreteMock = (override: Partial<Lembrete> = {}): Lembrete => ({
  id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  titulo: 'Lembrete de Teste',
  horario: '12:00',
  tipoId: 'tipo-saude',
  concluido: false,
  criadoEm: new Date().toISOString(),
  ...override,
});
