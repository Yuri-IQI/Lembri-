import type { Lembrete, LembreteLivre } from '@/types/lembrete';
import { chaveData, somarDias } from '@/utils/tempo/data';

const CRIADO_EM = '2026-10-27T10:00:00.000Z';
const hoje = new Date();

export const lembretesIniciaisMock: Lembrete[] = [
  {
    id: 'mock-lavar-roupas',
    template: 'tarefa',
    titulo: 'Lavar roupas',
    horarios: ['12:00', '18:00'],
    repeticao: { modo: 'dias', dias: [0, 4] },
    materiais: ['Sabão em pó', 'Amaciante'],
    passos: ['Separar claras e escuras', 'Usar o ciclo normal', 'Pendurar no varal'],
    tipoIds: ['tipo-tarefas-domesticas'],
    ativo: true,
    criadoEm: CRIADO_EM,
    atualizadoEm: CRIADO_EM,
  },
  {
    id: 'mock-tomar-remedio',
    template: 'remedio',
    titulo: 'Losartana',
    quantidade: { valor: 1, unidade: 'comprimido' },
    horarios: ['09:00', '18:00'],
    repeticao: { modo: 'todo_dia' },
    comoTomar: 'Com refeição',
    iniciadoEm: '2026-08-12',
    reavisoMin: 10,
    tipoIds: ['tipo-saude'],
    ativo: true,
    criadoEm: CRIADO_EM,
    atualizadoEm: CRIADO_EM,
  },
  {
    id: 'mock-consulta-cardiologista',
    template: 'compromisso',
    titulo: 'Consulta no cardiologista',
    data: chaveData(somarDias(hoje, 3)),
    horario: '14:30',
    avisarAntes: ['1h', '1d'],
    participantes: ['Ana', 'Dr. Paulo'],
    local: 'Clínica São José',
    oQueLevar: ['Exames anteriores', 'Lista de remédios'],
    tipoIds: [],
    ativo: true,
    criadoEm: CRIADO_EM,
    atualizadoEm: CRIADO_EM,
  },
  {
    id: 'mock-ligar-ana',
    template: 'livre',
    titulo: 'Ligar para a Ana',
    descricao: 'Perguntar sobre o aniversário do neto.',
    horarios: ['10:00'],
    repeticao: { modo: 'nao_repete', data: chaveData(somarDias(hoje, 1)) },
    tipoIds: [],
    ativo: true,
    criadoEm: CRIADO_EM,
    atualizadoEm: CRIADO_EM,
  },
  {
    id: 'mock-regar-plantas',
    template: 'tarefa',
    titulo: 'Regar plantas',
    horarios: ['07:30'],
    repeticao: { modo: 'dias', dias: [1, 3, 5] },
    materiais: ['Regador'],
    passos: [],
    tipoIds: ['tipo-tarefas-domesticas'],
    ativo: false,
    criadoEm: CRIADO_EM,
    atualizadoEm: CRIADO_EM,
  },
];

export const criarLembreteMock = (override: Partial<LembreteLivre> = {}): LembreteLivre => {
  const agora = new Date().toISOString();
  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    template: 'livre',
    titulo: 'Lembrete de Teste',
    horarios: ['12:00'],
    repeticao: { modo: 'todo_dia' },
    tipoIds: ['tipo-saude'],
    ativo: true,
    criadoEm: agora,
    atualizadoEm: agora,
    ...override,
  };
};
