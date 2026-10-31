export const doisDigitos = (n: number) => String(n).padStart(2, '0');

export const inicioDoDia = (data: Date): Date =>
  new Date(data.getFullYear(), data.getMonth(), data.getDate());

export const somarDias = (data: Date, dias: number): Date =>
  new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);

/** Data no formato AAAA-MM-DD, no fuso local. */
export const chaveData = (data: Date): string =>
  `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;

/** Lê uma data AAAA-MM-DD como meia-noite local; null se for inválida. */
export const lerData = (texto: string): Date | null => {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!partes) return null;
  const data = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  return chaveData(data) === texto ? data : null;
};

/** Lê um horário HH:mm; null se for inválido. */
export const lerHorario = (horario: string): [number, number] | null => {
  const partes = /^(\d{2}):(\d{2})$/.exec(horario);
  if (!partes) return null;
  const horas = Number(partes[1]);
  const minutos = Number(partes[2]);
  return horas > 23 || minutos > 59 ? null : [horas, minutos];
};

/** Junta uma data AAAA-MM-DD e um horário HH:mm; null se algum for inválido. */
export const juntarDataHorario = (data: string, horario: string): Date | null => {
  const dia = lerData(data);
  const hm = lerHorario(horario);
  if (!dia || !hm) return null;
  return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hm[0], hm[1]);
};

/** Data AAAA-MM-DD no formato dd/mm/aaaa. */
export const formatarData = (data: string): string => {
  const dia = lerData(data);
  return dia
    ? `${doisDigitos(dia.getDate())}/${doisDigitos(dia.getMonth() + 1)}/${dia.getFullYear()}`
    : data;
};

export const NOMES_MES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** Dias de um mês em semanas (domingo primeiro); null nas casas fora do mês. */
export const semanasDoMes = (ano: number, mes: number): (Date | null)[][] => {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const casas: (Date | null)[] = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: totalDias }, (_, i) => new Date(ano, mes, i + 1)),
  ];
  while (casas.length % 7 !== 0) casas.push(null);
  return Array.from({ length: casas.length / 7 }, (_, i) => casas.slice(i * 7, i * 7 + 7));
};
