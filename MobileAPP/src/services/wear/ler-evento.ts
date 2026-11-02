import { ExerciciosRelogio, VERSAO_CONTRATO, type EventoRelogio } from './contrato';

const IDS_EXERCICIO: string[] = Object.values(ExerciciosRelogio);

const ehEvento = (valor: Partial<EventoRelogio> | null): valor is EventoRelogio => {
  if (valor?.v !== VERSAO_CONTRATO) return false;
  if (valor.tipo === 'feito') return typeof valor.chave === 'string';
  return valor.tipo === 'exercicio' && IDS_EXERCICIO.includes(valor.exercicioId ?? '');
};

export const lerEvento = (payload: string): EventoRelogio | null => {
  try {
    const valor: Partial<EventoRelogio> | null = JSON.parse(payload);
    return ehEvento(valor) ? valor : null;
  } catch {
    return null;
  }
};
