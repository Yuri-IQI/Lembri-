import type { DadosLembrete, Lembrete, TemplateId } from '@/types/lembrete';
import { chaveData } from '@/utils/data';

/**
 * Valores padrão de cada template ao criar um lembrete.
 */
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
        exigeConfirmacao: true,
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
        exigeConfirmacao: false,
      };
    case 'tarefa':
      return {
        ...base,
        template,
        horarios: [],
        repeticao: { modo: 'todo_dia' },
        materiais: [],
        passos: [],
        exigeConfirmacao: false,
      };
    case 'livre':
      return {
        ...base,
        template,
        horarios: [],
        repeticao: { modo: 'nao_repete', data: chaveData(hoje) },
        exigeConfirmacao: false,
      };
  }
};

/** Dados de um lembrete salvo, prontos para o formulário de edição. */
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
