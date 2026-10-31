import type { Lembrete, OcorrenciaLembrete, RegistroFeito } from '@/types/lembrete';
import {
  chaveData,
  doisDigitos,
  inicioDoDia,
  juntarDataHorario,
  lerHorario,
  somarDias,
} from '@/utils/data';
import { horariosDoLembrete, ocorreNoDia } from '@/utils/lembrete';

const MS_DIA = 24 * 60 * 60 * 1000;

const inicioDoMinuto = (data: Date): number => Math.floor(data.getTime() / 60000) * 60000;

export const ocorrenciasDoDia = (lembretes: Lembrete[], data: Date): OcorrenciaLembrete[] => {
  const dia = inicioDoDia(data);
  const ocorrencias: OcorrenciaLembrete[] = [];

  for (const lembrete of lembretes) {
    if (!lembrete.ativo || !ocorreNoDia(lembrete, dia)) continue;
    for (const horario of horariosDoLembrete(lembrete)) {
      const hm = lerHorario(horario);
      if (!hm) continue;
      ocorrencias.push({
        chave: `${lembrete.id}@${chaveData(dia)}T${horario}`,
        lembrete,
        horario,
        quando: new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hm[0], hm[1]),
      });
    }
  }

  return ocorrencias.sort((a, b) => a.quando.getTime() - b.quando.getTime());
};

export interface ProximasOcorrencias {
  dia: Date;
  ocorrencias: OcorrenciaLembrete[];
}

export const proximasOcorrencias = (
  lembretes: Lembrete[],
  agora: Date
): ProximasOcorrencias | null => {
  const minutoAtual = inicioDoMinuto(agora);
  const restantesHoje = ocorrenciasDoDia(lembretes, agora).filter(
    (o) => o.quando.getTime() >= minutoAtual
  );
  if (restantesHoje.length > 0) return { dia: inicioDoDia(agora), ocorrencias: restantesHoje };

  for (let i = 1; i <= 7; i++) {
    const dia = somarDias(agora, i);
    const ocorrencias = ocorrenciasDoDia(lembretes, dia);
    if (ocorrencias.length > 0) return { dia, ocorrencias };
  }
  return null;
};

/** Dias depois de hoje em que o card de próximo lembrete procura. */
export const DIAS_PROXIMO_LEMBRETE = 3;

/** "A seguir" mostra só hoje e amanhã: os dias em que dá para marcar como feito. */
export const ateAmanha = (ocorrencia: OcorrenciaLembrete, agora: Date): boolean =>
  ocorrencia.quando < somarDias(agora, 2);

/** O que ainda vai acontecer: o resto de hoje e os próximos `dias` dias, em ordem. */
export const ocorrenciasFuturas = (
  lembretes: Lembrete[],
  agora: Date,
  dias: number
): OcorrenciaLembrete[] => {
  const minutoAtual = inicioDoMinuto(agora);
  const futuras = ocorrenciasDoDia(lembretes, agora).filter(
    (o) => o.quando.getTime() >= minutoAtual
  );
  for (let i = 1; i <= dias; i++) futuras.push(...ocorrenciasDoDia(lembretes, somarDias(agora, i)));
  return futuras;
};

/** O que já passou de hoje e tudo de ontem, do mais recente para o mais antigo. */
export const ocorrenciasPassadas = (lembretes: Lembrete[], agora: Date): OcorrenciaLembrete[] => {
  const minutoAtual = inicioDoMinuto(agora);
  const passadasHoje = ocorrenciasDoDia(lembretes, agora).filter(
    (o) => o.quando.getTime() < minutoAtual
  );
  return [...passadasHoje, ...ocorrenciasDoDia(lembretes, somarDias(agora, -1))].sort(
    (a, b) => b.quando.getTime() - a.quando.getTime()
  );
};

export const lembretesPausados = (lembretes: Lembrete[]): Lembrete[] =>
  lembretes.filter((item) => !item.ativo);

const NOMES_DIA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export const descreverDia = (dia: Date, agora: Date): string => {
  const diferenca = Math.round(
    (inicioDoDia(dia).getTime() - inicioDoDia(agora).getTime()) / MS_DIA
  );
  if (diferenca === 0) return 'hoje';
  if (diferenca === 1) return 'amanhã';
  if (diferenca === -1) return 'ontem';
  const nome = NOMES_DIA[dia.getDay()];
  if (Math.abs(diferenca) < 7) {
    const artigo = dia.getDay() === 0 || dia.getDay() === 6 ? 'no' : 'na';
    return `${artigo} ${nome}`;
  }
  return `em ${doisDigitos(dia.getDate())}/${doisDigitos(dia.getMonth() + 1)}`;
};

export const proximaOcorrenciaDoLembrete = (
  lembrete: Lembrete,
  agora: Date
): OcorrenciaLembrete | null => proximasOcorrencias([lembrete], agora)?.ocorrencias[0] ?? null;

// PENDÊNCIA: virar uma configuração em Ajustes; por enquanto, fixo em "passados, hoje e amanhã".
export type RegraMarcarFeito = 'ate-amanha' | 'passados' | 'todos';

export const MARCAR_FEITO_EM = 'ate-amanha' as RegraMarcarFeito;

export const podeMarcarFeito = (ocorrencia: OcorrenciaLembrete, agora: Date): boolean => {
  if (MARCAR_FEITO_EM === 'todos') return true;
  if (ocorrencia.quando.getTime() < inicioDoMinuto(agora)) return true;
  return MARCAR_FEITO_EM === 'ate-amanha' && ateAmanha(ocorrencia, agora);
};

export const descreverQuando = (data: Date, agora: Date): string => {
  const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
  const diferenca = Math.round(
    (inicioDoDia(data).getTime() - inicioDoDia(agora).getTime()) / MS_DIA
  );
  const dia =
    diferenca === 0
      ? 'Hoje'
      : diferenca === 1
        ? 'Amanhã'
        : diferenca === -1
          ? 'Ontem'
          : Math.abs(diferenca) < 7
            ? NOMES_DIA[data.getDay()].charAt(0).toUpperCase() + NOMES_DIA[data.getDay()].slice(1)
            : `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;
  return `${dia}, ${hora}`;
};

export type StatusCompromisso = 'agendado' | 'concluido' | 'nao_confirmado';

/** Depois que a data passa, o compromisso fica "Concluído" (com registro de feito) ou "Não confirmado". */
export const statusCompromisso = (
  lembrete: Lembrete,
  registros: RegistroFeito[],
  agora: Date
): StatusCompromisso | null => {
  if (lembrete.template !== 'compromisso') return null;
  const quando = juntarDataHorario(lembrete.data, lembrete.horario);
  if (!quando || quando.getTime() >= inicioDoMinuto(agora)) return 'agendado';
  return registros.some((r) => r.lembreteId === lembrete.id) ? 'concluido' : 'nao_confirmado';
};
