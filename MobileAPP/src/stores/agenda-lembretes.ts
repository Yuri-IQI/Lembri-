import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';

const MS_DIA = 24 * 60 * 60 * 1000;

const inicioDoDia = (data: Date): Date =>
  new Date(data.getFullYear(), data.getMonth(), data.getDate());

const somarDias = (data: Date, dias: number): Date =>
  new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);

const inicioDoMinuto = (data: Date): number => Math.floor(data.getTime() / 60000) * 60000;

const lerHorario = (horario: string): [number, number] | null => {
  const partes = /^(\d{2}):(\d{2})$/.exec(horario);
  if (!partes) return null;
  const horas = Number(partes[1]);
  const minutos = Number(partes[2]);
  return horas > 23 || minutos > 59 ? null : [horas, minutos];
};

const doisDigitos = (n: number) => String(n).padStart(2, '0');

const chaveDoDia = (dia: Date) =>
  `${dia.getFullYear()}-${doisDigitos(dia.getMonth() + 1)}-${doisDigitos(dia.getDate())}`;

export const ocorrenciasDoDia = (lembretes: Lembrete[], data: Date): OcorrenciaLembrete[] => {
  const dia = inicioDoDia(data);
  const diaSemana = dia.getDay();
  const ocorrencias: OcorrenciaLembrete[] = [];

  for (const lembrete of lembretes) {
    if (!lembrete.ativo || !lembrete.dias.includes(diaSemana as Lembrete['dias'][number])) continue;
    for (const horario of lembrete.horarios) {
      const hm = lerHorario(horario);
      if (!hm) continue;
      ocorrencias.push({
        chave: `${lembrete.id}@${chaveDoDia(dia)}T${horario}`,
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

export interface OcorrenciasPassadas {
  periodo: 'hoje' | 'semana';
  ocorrencias: OcorrenciaLembrete[];
}

export const ocorrenciasPassadas = (lembretes: Lembrete[], agora: Date): OcorrenciasPassadas => {
  const minutoAtual = inicioDoMinuto(agora);
  const maisRecentesPrimeiro = (a: OcorrenciaLembrete, b: OcorrenciaLembrete) =>
    b.quando.getTime() - a.quando.getTime();

  const passadasHoje = ocorrenciasDoDia(lembretes, agora).filter(
    (o) => o.quando.getTime() < minutoAtual
  );
  if (passadasHoje.length > 0) {
    return { periodo: 'hoje', ocorrencias: passadasHoje.sort(maisRecentesPrimeiro) };
  }

  const semana: OcorrenciaLembrete[] = [];
  for (let i = 1; i <= inicioDoDia(agora).getDay(); i++) {
    semana.push(...ocorrenciasDoDia(lembretes, somarDias(agora, -i)));
  }
  return { periodo: 'semana', ocorrencias: semana.sort(maisRecentesPrimeiro) };
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
  const diferenca = Math.round((inicioDoDia(dia).getTime() - inicioDoDia(agora).getTime()) / MS_DIA);
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

// PENDÊNCIA: virar uma configuração em Ajustes; por enquanto, fixo em "passados e o próximo".
export type RegraMarcarFeito = 'passados-e-proximo' | 'passados' | 'todos';

export const MARCAR_FEITO_EM = 'passados-e-proximo' as RegraMarcarFeito;

export const podeMarcarFeito = (
  ocorrencia: OcorrenciaLembrete,
  proxima: OcorrenciaLembrete | null,
  agora: Date
): boolean => {
  if (MARCAR_FEITO_EM === 'todos') return true;
  if (ocorrencia.quando.getTime() < inicioDoMinuto(agora)) return true;
  return MARCAR_FEITO_EM === 'passados-e-proximo' && ocorrencia.chave === proxima?.chave;
};

export const descreverQuando = (data: Date, agora: Date): string => {
  const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
  const diferenca = Math.round((inicioDoDia(data).getTime() - inicioDoDia(agora).getTime()) / MS_DIA);
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
