import type { DadosLembrete, Lembrete, TemplateId } from '@/types/lembrete';
import { chaveData } from '@/utils/tempo/data';

export const dadosIniciais = (
  template: TemplateId,
  tipoIds: string[],
  hoje: Date
): DadosLembrete => {
  const base = { titulo: '', tipoIds };
  switch (template) {
    case 'remedio':
      return {
        ...base,
        template,
        quantidade: { valor: 1, unidade: 'comprimido' },
        horarios: [],
        repeticao: { modo: 'todo_dia' },
        iniciadoEm: chaveData(hoje),
        reavisoMin: 10,
      };
    case 'compromisso':
      return {
        ...base,
        template,
        data: '',
        horario: '',
        avisarAntes: ['1h', '1d'],
        participantes: [],
        oQueLevar: [],
      };
    case 'tarefa':
      return {
        ...base,
        template,
        horarios: [],
        repeticao: { modo: 'todo_dia' },
        materiais: [],
        passos: [],
      };
    case 'livre':
      return {
        ...base,
        template,
        horarios: [],
        repeticao: { modo: 'nao_repete', data: chaveData(hoje) },
      };
  }
};

export const dadosDoLembrete = (lembrete: Lembrete): DadosLembrete => {
  const {
    id: _id,
    ativo: _ativo,
    criadoEm: _criadoEm,
    atualizadoEm: _atualizadoEm,
    ...dados
  } = lembrete;
  return dados;
};
