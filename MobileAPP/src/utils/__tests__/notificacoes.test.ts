import { criarLembreteMock, lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type { LembreteCompromisso, LembreteRemedio } from '@/types/lembrete';
import { DIAS_NOTIFICACOES, notificacoesDesejadas, ocorrenciaDaChave } from '@/utils/notificacoes/notificacoes';

const igual = (actual: unknown, expected: unknown, message?: string) => {
  if (actual !== expected) {
    throw new Error(`Assertion failed: [${actual}] !== [${expected}]. ${message ?? ''}`);
  }
};

const sexta = new Date(2026, 9, 30, 10, 0);
const lembrete = criarLembreteMock({
  id: 'agua',
  titulo: 'Beber água',
  horarios: ['08:00', '12:00'],
});

{
  const desejadas = notificacoesDesejadas([lembrete], new Set(), sexta);
  igual(desejadas[0].id, 'agua@2026-10-30T12:00', 'O das 08:00 de hoje já passou');
  igual(desejadas[0].titulo, 'Beber água');
  igual(desejadas[0].lembreteId, 'agua');
  igual(
    desejadas.every((n) => n.quando > sexta),
    true
  );
  igual(desejadas.length >= DIAS_NOTIFICACOES * 2 - 1, true, 'Cobre a semana');
}

{
  const desejadas = notificacoesDesejadas([lembrete], new Set(['agua@2026-10-30T12:00']), sexta);
  igual(desejadas[0].id, 'agua@2026-10-31T08:00');
}

{
  igual(notificacoesDesejadas([{ ...lembrete, ativo: false }], new Set(), sexta).length, 0);
}

const remedio = { ...lembretesIniciaisMock[1], id: 'los' } as LembreteRemedio;
const consulta = {
  ...lembretesIniciaisMock[2],
  id: 'consulta',
  data: '2026-11-02',
  horario: '14:30',
} as LembreteCompromisso;

{
  const desejadas = notificacoesDesejadas([remedio], new Set(), sexta);
  const reaviso = desejadas.find((n) => n.id === 'los@2026-10-30T18:00#reaviso');
  igual(reaviso?.quando.getHours(), 18);
  igual(reaviso?.quando.getMinutes(), 10);
  igual(reaviso?.ocorrencia, 'los@2026-10-30T18:00');
  igual(reaviso?.categoria, 'tomei');
  igual(desejadas[0].corpo, 'Hora de tomar 1 comprimido.');
}

{
  const logoDepois = new Date(2026, 9, 30, 9, 5);
  const desejadas = notificacoesDesejadas([remedio], new Set(), logoDepois);
  igual(desejadas[0].id, 'los@2026-10-30T09:00#reaviso');
  const feito = notificacoesDesejadas([remedio], new Set(['los@2026-10-30T09:00']), logoDepois);
  igual(feito[0].id, 'los@2026-10-30T18:00', 'Feito cancela o reaviso');
}

{
  const desejadas = notificacoesDesejadas([consulta], new Set(), sexta);
  igual(desejadas.length, 3);
  igual(desejadas[0].id, 'consulta@2026-11-02T14:30#antes-1d');
  igual(desejadas[0].quando.getDate(), 1);
  igual(desejadas[0].corpo, 'Amanhã, às 14:30 · Clínica São José');
  igual(desejadas[0].categoria, undefined);
  igual(desejadas[1].id, 'consulta@2026-11-02T14:30#antes-1h');
  igual(desejadas[1].quando.getHours(), 13);
  igual(desejadas[2].categoria, 'fiz');
}

{
  const ocorrencia = ocorrenciaDaChave('los@2026-10-30T18:00', [remedio]);
  igual(ocorrencia?.lembrete.id, 'los');
  igual(ocorrencia?.quando.getTime(), new Date(2026, 9, 30, 18, 0).getTime());
  igual(ocorrenciaDaChave('outro@2026-10-30T18:00', [remedio]), null);
  igual(ocorrenciaDaChave('los@2026-02-31T18:00', [remedio]), null);
}
