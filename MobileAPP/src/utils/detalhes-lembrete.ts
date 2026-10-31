import type { AvisoAntes, Lembrete } from '@/types/lembrete';
import { formatarData } from '@/utils/data';
import { formatarDose } from '@/utils/dose';
import { textoDeApoio } from '@/utils/lembrete';

export const NOMES_AVISO_ANTES: Record<AvisoAntes, string> = {
  '1h': '1 hora antes',
  '1d': '1 dia antes',
};

/** Linha da tela de detalhe: texto corrido ou lista de itens. */
export type DetalheLembrete = {
  rotulo: string;
  valor: string | string[];
  numerada?: boolean;
};

const presentes = (itens: (DetalheLembrete | false | undefined | '')[]) =>
  itens.filter((item): item is DetalheLembrete => !!item);

const detalhesDoTemplate = (lembrete: Lembrete): DetalheLembrete[] => {
  switch (lembrete.template) {
    case 'remedio':
      return presentes([
        {
          rotulo: 'Dose',
          valor: formatarDose(lembrete.quantidade.valor, lembrete.quantidade.unidade),
        },
        lembrete.comoTomar && { rotulo: 'Como tomar', valor: lembrete.comoTomar },
        { rotulo: 'Tomando desde', valor: formatarData(lembrete.iniciadoEm) },
        { rotulo: 'Se não confirmar', valor: `Avisa de novo em ${lembrete.reavisoMin} min` },
      ]);
    case 'compromisso':
      return presentes([
        lembrete.avisarAntes.length > 0 && {
          rotulo: 'Avisar antes',
          valor: lembrete.avisarAntes.map((aviso) => NOMES_AVISO_ANTES[aviso]).join(' e '),
        },
        lembrete.local && { rotulo: 'Local', valor: lembrete.local },
        lembrete.participantes.length > 0 && {
          rotulo: 'Participantes',
          valor: lembrete.participantes,
        },
        lembrete.oQueLevar.length > 0 && { rotulo: 'O que levar', valor: lembrete.oQueLevar },
      ]);
    case 'tarefa':
      return presentes([
        lembrete.materiais.length > 0 && { rotulo: 'O que vou usar', valor: lembrete.materiais },
        lembrete.passos.length > 0 && { rotulo: 'Passos', valor: lembrete.passos, numerada: true },
      ]);
    case 'livre':
      return [];
  }
};

/**
 * Detalhes próprios de cada template, mostrados abaixo de horários e repetição.
 */
export const detalhesDoLembrete = (lembrete: Lembrete): DetalheLembrete[] => {
  const apoio = textoDeApoio(lembrete);
  return [
    ...detalhesDoTemplate(lembrete),
    ...(apoio
      ? [{ rotulo: lembrete.template === 'livre' ? 'Descrição' : 'Observação', valor: apoio }]
      : []),
  ];
};

/** Informação curta para a linha da agenda: dose do remédio ou local do compromisso. */
export const resumoDoLembrete = (lembrete: Lembrete): string | undefined => {
  if (lembrete.template === 'remedio') {
    return formatarDose(lembrete.quantidade.valor, lembrete.quantidade.unidade);
  }
  if (lembrete.template === 'compromisso') return lembrete.local;
  return undefined;
};
