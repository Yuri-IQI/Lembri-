/**
 * Regex para validação de horário no padrão HH:mm (00:00 até 23:59).
 */
const REGEX_HORARIO = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

/**
 * Ajusta a hora ou o minuto de um horário formatado HH:mm, realizando o fechamento circular (wrap)
 * sem afetar o outro campo.
 *
 * Se a entrada não for um horário válido no padrão HH:mm, ela é normalizada para "00:00" antes do cálculo.
 *
 * @param horario - Horário no padrão HH:mm.
 * @param campo - Campo a ser ajustado ('hora' ou 'minuto').
 * @param delta - Quantidade de passos a somar (positivo) ou subtrair (negativo).
 * @param passoMinutos - Incremento em minutos para cada passo (padrão: 5).
 * @returns Horário atualizado no padrão HH:mm.
 */
export const ajustarHorario = (
  horario: string,
  campo: 'hora' | 'minuto',
  delta: number,
  passoMinutos = 5
): string => {
  let hora = 0;
  let minuto = 0;

  if (typeof horario === 'string' && REGEX_HORARIO.test(horario)) {
    const [h, m] = horario.split(':');
    hora = parseInt(h, 10);
    minuto = parseInt(m, 10);
  }

  if (campo === 'hora') {
    hora = (((hora + delta) % 24) + 24) % 24;
  } else {
    const variacaoMinutos = delta * passoMinutos;
    minuto = (((minuto + variacaoMinutos) % 60) + 60) % 60;
  }

  const horaFormatada = String(hora).padStart(2, '0');
  const minutoFormatado = String(minuto).padStart(2, '0');

  return `${horaFormatada}:${minutoFormatado}`;
};
