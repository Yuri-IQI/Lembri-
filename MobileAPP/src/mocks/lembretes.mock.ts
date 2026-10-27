import type { Lembrete } from '@/types/lembrete';

/**
 * Massa de dados mockados inicial para desenvolvimento e testes.
 */
export const lembretesIniciaisMock: Lembrete[] = [
  {
    id: 'mock-1',
    titulo: 'Tomar vitamina D',
    horario: '08:00',
    concluido: true,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    titulo: 'Alongamento matinal',
    horario: '09:30',
    concluido: false,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    titulo: 'Beber 500ml de água',
    horario: '11:00',
    concluido: false,
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    titulo: 'Caminhada de 15 minutos',
    horario: '16:00',
    concluido: false,
    criadoEm: new Date().toISOString(),
  },
];

/**
 * Fábrica de mocks para gerar lembretes parametrizados.
 */
export const criarLembreteMock = (override: Partial<Lembrete> = {}): Lembrete => ({
  id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  titulo: 'Lembrete de Teste',
  horario: '12:00',
  concluido: false,
  criadoEm: new Date().toISOString(),
  ...override,
});
