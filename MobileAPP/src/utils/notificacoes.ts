import { ocorrenciasFuturas } from '@/stores/agenda-lembretes';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';
import { juntarDataHorario } from '@/utils/data';
import { rotuloFeito } from '@/utils/lembrete';
import { avisosAntes, corpoNaHora, corpoReaviso } from '@/utils/textos-notificacao';

/** Dias depois de hoje que ficam agendados; o resto é agendado quando o app volta a abrir. */
export const DIAS_NOTIFICACOES = 7;
export const MAXIMO_NOTIFICACOES = 100;
export const MINUTOS_ADIAR = 10;

const MS_MINUTO = 60_000;
const MAIOR_REAVISO_MIN = 15;

/** Botões da notificação: "Tomei" no remédio, "Fiz" nos outros. */
export type CategoriaNotificacao = 'tomei' | 'fiz';

export type NotificacaoLembrete = {
  /** Chave da ocorrência, com sufixo nos avisos extras (`#reaviso`, `#antes-1h`…). */
  id: string;
  /** Chave da ocorrência a que o aviso se refere. */
  ocorrencia: string;
  lembreteId: string;
  titulo: string;
  corpo: string;
  quando: Date;
  /** Sem categoria, a notificação não tem botões (ex.: aviso antes do compromisso). */
  categoria?: CategoriaNotificacao;
};

/** Sufixo da notificação recriada pelo botão "Lembrar em 10 min". */
export const SUFIXO_ADIADA = '#adiado';
export const SUFIXO_REAVISO = '#reaviso';

const categoriaDo = (lembrete: Lembrete): CategoriaNotificacao =>
  rotuloFeito(lembrete) === 'Tomei' ? 'tomei' : 'fiz';

const avisosDaOcorrencia = (o: OcorrenciaLembrete): NotificacaoLembrete[] => {
  const base = { ocorrencia: o.chave, lembreteId: o.lembrete.id, titulo: o.lembrete.titulo };
  const categoria = categoriaDo(o.lembrete);
  const avisos: NotificacaoLembrete[] = [
    { ...base, id: o.chave, corpo: corpoNaHora(o), quando: o.quando, categoria },
  ];
  if (o.lembrete.template === 'remedio') {
    avisos.push({
      ...base,
      id: `${o.chave}${SUFIXO_REAVISO}`,
      corpo: corpoReaviso(o.lembrete),
      quando: new Date(o.quando.getTime() + o.lembrete.reavisoMin * MS_MINUTO),
      categoria,
    });
  }
  for (const aviso of avisosAntes(o)) avisos.push({ ...base, ...aviso });
  return avisos;
};

/**
 * Notificações que deveriam estar agendadas: a hora de cada lembrete ativo, o reaviso do remédio
 * e os avisos antes do compromisso, menos os horários já marcados como feitos.
 */
export const notificacoesDesejadas = (
  lembretes: Lembrete[],
  feitos: Set<string>,
  agora: Date
): NotificacaoLembrete[] => {
  const desde = new Date(agora.getTime() - MAIOR_REAVISO_MIN * MS_MINUTO);
  return ocorrenciasFuturas(lembretes, desde, DIAS_NOTIFICACOES + 1)
    .filter((o) => !feitos.has(o.chave))
    .flatMap(avisosDaOcorrencia)
    .filter((n) => n.quando > agora)
    .sort((a, b) => a.quando.getTime() - b.quando.getTime())
    .slice(0, MAXIMO_NOTIFICACOES);
};

/** Refaz a ocorrência a partir da chave `<id>@<AAAA-MM-DD>T<HH:mm>`. */
export const ocorrenciaDaChave = (
  chave: string,
  lembretes: Lembrete[]
): OcorrenciaLembrete | null => {
  const [lembreteId, momento = ''] = chave.split('@');
  const [data = '', horario = ''] = momento.split('T');
  const lembrete = lembretes.find((item) => item.id === lembreteId);
  const quando = juntarDataHorario(data, horario);
  return lembrete && quando ? { chave, lembrete, horario, quando } : null;
};
