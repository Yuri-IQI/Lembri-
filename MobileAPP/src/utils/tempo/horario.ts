const REGEX_HORARIO = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

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
