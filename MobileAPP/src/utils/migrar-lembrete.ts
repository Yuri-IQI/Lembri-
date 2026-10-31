import { DIAS_SEMANA, type DiaSemana, type Lembrete, type Repeticao } from '@/types/lembrete';

/**
 * Lembrete no formato anterior aos templates: sem `template` e com `dias` no lugar de `repeticao`.
 */
export interface LembreteLegado {
  id: string;
  titulo: string;
  descricao?: string;
  horarios: string[];
  dias: DiaSemana[];
  tipoId?: string;
  ativo: boolean;
  criadoEm: string;
}

const repeticaoDeDias = (dias: DiaSemana[]): Repeticao => {
  const unicos = [...new Set(dias)].sort();
  return unicos.length === DIAS_SEMANA.length
    ? { modo: 'todo_dia' }
    : { modo: 'dias', dias: unicos };
};

const COMO_TOMAR_LEGADO: Record<string, string> = {
  jejum: 'Em jejum',
  com_refeicao: 'Com refeição',
  tanto_faz: 'Tanto faz',
};

const UNIDADE_LEGADA: Record<string, string> = { capsula: 'cápsula' };

/** Remédios da versão 1 guardavam unidade e "como tomar" como códigos; agora são texto. */
const atualizarRemedio = (lembrete: Lembrete): Lembrete =>
  lembrete.template !== 'remedio'
    ? lembrete
    : {
        ...lembrete,
        quantidade: {
          ...lembrete.quantidade,
          unidade: UNIDADE_LEGADA[lembrete.quantidade.unidade] ?? lembrete.quantidade.unidade,
        },
        comoTomar:
          lembrete.comoTomar && (COMO_TOMAR_LEGADO[lembrete.comoTomar] ?? lembrete.comoTomar),
      };

/** Lembrete da versão 2: um tipo só, em `tipoId`. */
export type LembreteV2 = Omit<Lembrete, 'tipoIds'> & { tipoIds?: string[]; tipoId?: string };

const atualizarTipos = ({ tipoId, ...resto }: LembreteV2): Lembrete =>
  ({
    ...resto,
    tipoIds: resto.tipoIds ?? (tipoId ? [tipoId] : []),
  }) as Lembrete;

const ehLegado = (bruto: LembreteV2 | LembreteLegado): bruto is LembreteLegado =>
  !('template' in bruto) || !bruto.template;

/**
 * Converte um lembrete salvo em formato antigo para o atual: sem `template` vira Livre, e
 * remédios com códigos de unidade e "como tomar" passam a usar o texto e `tipoId` vira `tipoIds`.
 */
export const migrarLembrete = (bruto: LembreteV2 | LembreteLegado): Lembrete => {
  if (!ehLegado(bruto)) return atualizarRemedio(atualizarTipos(bruto));
  return {
    id: bruto.id,
    template: 'livre',
    titulo: bruto.titulo,
    descricao: bruto.descricao,
    tipoIds: bruto.tipoId ? [bruto.tipoId] : [],
    horarios: [...bruto.horarios],
    repeticao: repeticaoDeDias(bruto.dias),
    exigeConfirmacao: false,
    ativo: bruto.ativo,
    criadoEm: bruto.criadoEm,
    atualizadoEm: bruto.criadoEm,
  };
};
