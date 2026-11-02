import type { DiaSemana, Lembrete, TemplateId } from '@/types/lembrete';
import { chaveData, formatarData } from '@/utils/tempo/data';
import { descreverRepeticao } from '@/utils/lembrete/frequencia';
import { normalizarBusca } from '@/utils/texto/texto';

export const horariosDoLembrete = (lembrete: Lembrete): string[] =>
  lembrete.template === 'compromisso' ? [lembrete.horario] : lembrete.horarios;

export const ocorreNoDia = (lembrete: Lembrete, dia: Date): boolean => {
  if (lembrete.template === 'compromisso') return lembrete.data === chaveData(dia);
  const { repeticao } = lembrete;
  if (repeticao.modo === 'todo_dia') return true;
  if (repeticao.modo === 'dias') return repeticao.dias.includes(dia.getDay() as DiaSemana);
  return repeticao.data === chaveData(dia);
};

export const descreverAgenda = (lembrete: Lembrete): string =>
  lembrete.template === 'compromisso'
    ? `Só em ${formatarData(lembrete.data)}`
    : descreverRepeticao(lembrete.repeticao);

export const rotuloFeito = (lembrete: Lembrete): string =>
  lembrete.template === 'remedio' ? 'Tomei' : 'Fiz';

export const textoDeApoio = (lembrete: Lembrete): string | undefined =>
  lembrete.template === 'livre'
    ? lembrete.descricao
    : lembrete.template === 'tarefa'
      ? undefined
      : lembrete.observacao;

export type FiltrosLembrete = {
  tipoIds: string[];
  templates: TemplateId[];
};

export const FILTROS_VAZIOS: FiltrosLembrete = { tipoIds: [], templates: [] };

export const filtrarLembretes = (
  lembretes: Lembrete[],
  busca: string,
  filtros: FiltrosLembrete = FILTROS_VAZIOS
): Lembrete[] => {
  const termo = normalizarBusca(busca);
  return lembretes.filter(
    (lembrete) =>
      (!termo || normalizarBusca(lembrete.titulo).includes(termo)) &&
      (filtros.templates.length === 0 || filtros.templates.includes(lembrete.template)) &&
      (filtros.tipoIds.length === 0 || lembrete.tipoIds.some((id) => filtros.tipoIds.includes(id)))
  );
};
