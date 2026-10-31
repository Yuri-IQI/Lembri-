import type { DadosLembrete, Repeticao, TemplateId } from '@/types/lembrete';
import { chaveData, juntarDataHorario } from '@/utils/data';

export const LIMITE_OBSERVACAO = 200;
export const LIMITE_PASSOS = 10;
export const LIMITE_TEXTO_PASSO = 80;

export type CampoComErro =
  | 'titulo'
  | 'quantidade'
  | 'horarios'
  | 'dias'
  | 'dataRepeticao'
  | 'iniciadoEm'
  | 'data'
  | 'horario'
  | 'passos'
  | 'observacao';

export type ErrosFormulario = Partial<Record<CampoComErro, string>>;

/** Ordem dos campos na tela, para rolar até o primeiro erro. */
export const ORDEM_CAMPOS: CampoComErro[] = [
  'titulo',
  'quantidade',
  'horario',
  'data',
  'horarios',
  'dias',
  'dataRepeticao',
  'iniciadoEm',
  'passos',
  'observacao',
];

const TITULO_VAZIO: Record<TemplateId, string> = {
  remedio: 'Escreva o nome do remédio.',
  compromisso: 'Escreva o que é o compromisso.',
  tarefa: 'Escreva qual é a tarefa.',
  livre: 'Escreva um título.',
};

const errosDeRepeticao = (
  repeticao: Repeticao,
  hoje: string,
  original?: Repeticao
): ErrosFormulario => {
  if (repeticao.modo === 'dias' && repeticao.dias.length === 0) {
    return { dias: 'Escolha pelo menos um dia.' };
  }
  if (repeticao.modo !== 'nao_repete') return {};
  if (!repeticao.data) return { dataRepeticao: 'Escolha a data.' };
  const mantida = original?.modo === 'nao_repete' && original.data === repeticao.data;
  return repeticao.data < hoje && !mantida
    ? { dataRepeticao: 'Escolha uma data a partir de hoje.' }
    : {};
};

const errosDeHorarios = (horarios: string[]): ErrosFormulario => {
  if (horarios.length === 0) return { horarios: 'Adicione pelo menos um horário.' };
  return new Set(horarios).size < horarios.length
    ? { horarios: 'Há horários repetidos. Mude ou remova um deles.' }
    : {};
};

const errosDeObservacao = (texto?: string): ErrosFormulario =>
  (texto?.length ?? 0) > LIMITE_OBSERVACAO
    ? { observacao: `Use no máximo ${LIMITE_OBSERVACAO} letras.` }
    : {};

/**
 * Erros do formulário por campo; objeto vazio quando está tudo certo.
 * Datas que já estavam salvas (`original`) podem continuar no passado ao editar.
 */
export const validarLembrete = (
  dados: DadosLembrete,
  agora: Date,
  original?: DadosLembrete
): ErrosFormulario => {
  const hoje = chaveData(agora);
  const erros: ErrosFormulario = dados.titulo.trim()
    ? {}
    : { titulo: TITULO_VAZIO[dados.template] };

  switch (dados.template) {
    case 'remedio': {
      const antes = original?.template === 'remedio' ? original : undefined;
      return {
        ...erros,
        ...(dados.quantidade.valor > 0 && dados.quantidade.unidade.trim()
          ? {}
          : { quantidade: 'Escreva a quantidade e a medida.' }),
        ...errosDeHorarios(dados.horarios),
        ...errosDeRepeticao(dados.repeticao, hoje, antes?.repeticao),
        ...(!dados.iniciadoEm
          ? { iniciadoEm: 'Escolha quando começou.' }
          : dados.iniciadoEm > hoje
            ? { iniciadoEm: 'A data de início não pode ser depois de hoje.' }
            : {}),
        ...errosDeObservacao(dados.observacao),
      };
    }
    case 'compromisso': {
      const antes = original?.template === 'compromisso' ? original : undefined;
      const quando = juntarDataHorario(dados.data, dados.horario);
      const mantido = antes?.data === dados.data && antes?.horario === dados.horario;
      return {
        ...erros,
        ...(!dados.data ? { data: 'Escolha a data.' } : {}),
        ...(!dados.horario ? { horario: 'Escolha o horário.' } : {}),
        ...(quando && quando.getTime() < agora.getTime() && !mantido
          ? { horario: 'Escolha uma data e horário que ainda não passaram.' }
          : {}),
        ...errosDeObservacao(dados.observacao),
      };
    }
    case 'tarefa': {
      const antes = original?.template === 'tarefa' ? original : undefined;
      return {
        ...erros,
        ...errosDeHorarios(dados.horarios),
        ...errosDeRepeticao(dados.repeticao, hoje, antes?.repeticao),
        ...(dados.passos.length > LIMITE_PASSOS
          ? { passos: `Use no máximo ${LIMITE_PASSOS} passos.` }
          : {}),
      };
    }
    case 'livre': {
      const antes = original?.template === 'livre' ? original : undefined;
      return {
        ...erros,
        ...errosDeHorarios(dados.horarios),
        ...errosDeRepeticao(dados.repeticao, hoje, antes?.repeticao),
      };
    }
  }
};

export const primeiroErro = (erros: ErrosFormulario): CampoComErro | undefined =>
  ORDEM_CAMPOS.find((campo) => erros[campo]);
