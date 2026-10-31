import type { AvisoAntes, Lembrete, OcorrenciaLembrete } from '@/types/lembrete';
import { resumoDoLembrete } from '@/utils/detalhes-lembrete';

const MS_HORA = 3_600_000;

const ANTECEDENCIA: Record<AvisoAntes, { ms: number; texto: string }> = {
  '1h': { ms: MS_HORA, texto: 'Daqui a 1 hora' },
  '1d': { ms: 24 * MS_HORA, texto: 'Amanhã' },
};

const comResumo = (texto: string, lembrete: Lembrete) => {
  const resumo = resumoDoLembrete(lembrete);
  return resumo ? `${texto} · ${resumo}` : `${texto}.`;
};

export const corpoNaHora = ({ lembrete, horario }: OcorrenciaLembrete): string =>
  lembrete.template === 'remedio'
    ? `Hora de tomar ${resumoDoLembrete(lembrete)}.`
    : comResumo(`Agora, às ${horario}`, lembrete);

export const corpoReaviso = (lembrete: Lembrete): string =>
  `Você ainda não marcou que tomou ${resumoDoLembrete(lembrete)}.`;

/** Avisos escolhidos em "Avisar antes" do compromisso, sem botões. */
export const avisosAntes = ({ chave, lembrete, horario, quando }: OcorrenciaLembrete) =>
  lembrete.template !== 'compromisso'
    ? []
    : lembrete.avisarAntes.map((aviso) => ({
        id: `${chave}#antes-${aviso}`,
        corpo: comResumo(`${ANTECEDENCIA[aviso].texto}, às ${horario}`, lembrete),
        quando: new Date(quando.getTime() - ANTECEDENCIA[aviso].ms),
      }));
