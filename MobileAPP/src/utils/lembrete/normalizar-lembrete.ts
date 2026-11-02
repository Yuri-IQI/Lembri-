import { LIMITE_TIPOS, type DadosLembrete, type Repeticao } from '@/types/lembrete';

const textoOpcional = (texto?: string) => texto?.trim() || undefined;

const lista = (itens: string[]) => itens.map((item) => item.trim()).filter(Boolean);

export const normalizarHorarios = (horarios: string[]): string[] =>
  [...new Set(lista(horarios))].sort();

const normalizarRepeticao = (repeticao: Repeticao): Repeticao =>
  repeticao.modo === 'dias'
    ? { modo: 'dias', dias: [...new Set(repeticao.dias)].sort() }
    : repeticao;

export const normalizarDados = (entrada: DadosLembrete): DadosLembrete => {
  const dados = { ...entrada, tipoIds: [...new Set(entrada.tipoIds)].slice(0, LIMITE_TIPOS) };
  const titulo = dados.titulo.trim();
  switch (dados.template) {
    case 'remedio':
      return {
        ...dados,
        titulo,
        quantidade: { ...dados.quantidade, unidade: dados.quantidade.unidade.trim() },
        horarios: normalizarHorarios(dados.horarios),
        repeticao: normalizarRepeticao(dados.repeticao),
        comoTomar: textoOpcional(dados.comoTomar),
        observacao: textoOpcional(dados.observacao),
        exigeConfirmacao: true,
      };
    case 'compromisso':
      return {
        ...dados,
        titulo,
        participantes: lista(dados.participantes),
        local: textoOpcional(dados.local),
        oQueLevar: lista(dados.oQueLevar),
        observacao: textoOpcional(dados.observacao),
      };
    case 'tarefa':
      return {
        ...dados,
        titulo,
        horarios: normalizarHorarios(dados.horarios),
        repeticao: normalizarRepeticao(dados.repeticao),
        materiais: lista(dados.materiais),
        passos: lista(dados.passos),
      };
    case 'livre':
      return {
        ...dados,
        titulo,
        horarios: normalizarHorarios(dados.horarios),
        repeticao: normalizarRepeticao(dados.repeticao),
        descricao: textoOpcional(dados.descricao),
      };
  }
};
