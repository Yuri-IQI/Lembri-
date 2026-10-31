import { lerData } from '@/utils/data';

const digitos = (texto: string, maximo: number) => texto.replace(/\D/g, '').slice(0, maximo);

/** Formata a digitação como HH:mm ("1830" vira "18:30"). */
export const mascararHorario = (texto: string): string => {
  const d = digitos(texto, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
};

/** Formata a digitação como dd/mm/aaaa ("01112026" vira "01/11/2026"). */
export const mascararData = (texto: string): string => {
  const d = digitos(texto, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

/** Data digitada (dd/mm/aaaa) no formato AAAA-MM-DD; null se estiver incompleta ou não existir. */
export const lerDataDigitada = (texto: string): string | null => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return null;
  const chave = `${partes[3]}-${partes[2]}-${partes[1]}`;
  return lerData(chave) ? chave : null;
};
