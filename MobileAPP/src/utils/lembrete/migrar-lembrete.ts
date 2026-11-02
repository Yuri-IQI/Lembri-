import { DIAS_SEMANA, type DiaSemana, type Lembrete, type Repeticao } from '@/types/lembrete';

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

export type LembreteV2 = Omit<Lembrete, 'tipoIds'> & { tipoIds?: string[]; tipoId?: string };

const atualizarTipos = ({ tipoId, ...resto }: LembreteV2): Lembrete =>
  ({
    ...resto,
    tipoIds: resto.tipoIds ?? (tipoId ? [tipoId] : []),
  }) as Lembrete;

const ehLegado = (bruto: LembreteV2 | LembreteLegado): bruto is LembreteLegado =>
  !('template' in bruto) || !bruto.template;

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
    ativo: bruto.ativo,
    criadoEm: bruto.criadoEm,
    atualizadoEm: bruto.criadoEm,
  };
};
