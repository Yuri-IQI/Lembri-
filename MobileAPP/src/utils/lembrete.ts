import type { DiaSemana, Lembrete } from '@/types/lembrete';
import { chaveData, formatarData } from '@/utils/data';
import { descreverRepeticao } from '@/utils/frequencia';

/** Horários em que o lembrete alerta (o compromisso tem um só). */
export const horariosDoLembrete = (lembrete: Lembrete): string[] =>
  lembrete.template === 'compromisso' ? [lembrete.horario] : lembrete.horarios;

/** Se o lembrete tem alerta no dia informado (ativo ou não). */
export const ocorreNoDia = (lembrete: Lembrete, dia: Date): boolean => {
  if (lembrete.template === 'compromisso') return lembrete.data === chaveData(dia);
  const { repeticao } = lembrete;
  if (repeticao.modo === 'todo_dia') return true;
  if (repeticao.modo === 'dias') return repeticao.dias.includes(dia.getDay() as DiaSemana);
  return repeticao.data === chaveData(dia);
};

/** Quando o lembrete se repete, em texto curto ("Todos os dias", "Só em 12/11/2026"). */
export const descreverAgenda = (lembrete: Lembrete): string =>
  lembrete.template === 'compromisso'
    ? `Só em ${formatarData(lembrete.data)}`
    : descreverRepeticao(lembrete.repeticao);

/** Rótulo do botão de marcar como feito. */
export const rotuloFeito = (lembrete: Lembrete): string =>
  lembrete.template === 'remedio' ? 'Tomei' : 'Fiz';

/** Texto de apoio do lembrete (descrição, observação), quando houver. */
export const textoDeApoio = (lembrete: Lembrete): string | undefined =>
  lembrete.template === 'livre'
    ? lembrete.descricao
    : lembrete.template === 'tarefa'
      ? undefined
      : lembrete.observacao;
