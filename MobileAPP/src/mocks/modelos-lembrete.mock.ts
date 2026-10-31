import type { ModeloLembrete } from '@/types/modelo-lembrete';

/**
 * Modelos padrão de lembretes pré-definidos para agilizar a criação pelo usuário (CARD-26).
 */
export const modelosLembreteMock: ModeloLembrete[] = [
  {
    id: 'modelo-remedio',
    nome: 'Tomar remédio',
    icone: 'medication',
    titulo: 'Tomar remédio',
    tipoId: 'tipo-saude',
    horarios: ['08:00', '20:00'],
    dias: [0, 1, 2, 3, 4, 5, 6],
    descricao: 'Tomar medicamentos prescritos no horário correto.',
  },
  {
    id: 'modelo-agua',
    nome: 'Beber água',
    icone: 'water_drop',
    titulo: 'Beber água',
    tipoId: 'tipo-saude',
    horarios: ['09:00', '12:00', '15:00', '18:00'],
    dias: [0, 1, 2, 3, 4, 5, 6],
    descricao: 'Manter a hidratação diária com 1 copo de água.',
  },
  {
    id: 'modelo-exercicio',
    nome: 'Fazer exercício',
    icone: 'directions_walk',
    titulo: 'Fazer exercício',
    tipoId: 'tipo-saude',
    horarios: ['08:00'],
    dias: [1, 3, 5],
    descricao: 'Caminhada ou alongamento leve.',
  },
  {
    id: 'modelo-lavar-roupa',
    nome: 'Lavar roupa',
    icone: 'local_laundry_service',
    titulo: 'Lavar roupa',
    tipoId: 'tipo-tarefas-domesticas',
    horarios: ['10:00'],
    dias: [6],
    descricao: 'Separar e lavar roupas da semana.',
  },
  {
    id: 'modelo-consulta-longa',
    nome: 'Consulta médica de acompanhamento cardiológico',
    icone: 'event',
    titulo: 'Consulta médica de acompanhamento cardiológico',
    tipoId: 'tipo-removido',
    horarios: ['14:30'],
    dias: [2],
    descricao: 'Levar exames anteriores e lista de medicamentos em uso.',
  },
];

/**
 * Horários sugeridos frequentes para seleção rápida via chips no formulário.
 */
export const horariosSugeridosMock: string[] = ['08:00', '12:00', '18:00', '21:00'];
