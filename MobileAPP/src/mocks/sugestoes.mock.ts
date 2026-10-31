import type { FonteSugestao, Sugestao } from '@/types/sugestao';

const sugestao = (valor: string, usadoEm: string, vezes = 1): Sugestao => ({
  valor,
  usadoEm,
  vezes,
});

/**
 * Sugestões iniciais dos campos com autocompletar, para a demonstração já ter o que sugerir.
 */
export const sugestoesIniciaisMock: Record<FonteSugestao, Sugestao[]> = {
  remedios: [
    sugestao('Losartana', '2026-10-27T10:00:00.000Z', 3),
    sugestao('Metformina', '2026-10-20T10:00:00.000Z'),
  ],
  unidades: [
    sugestao('comprimido', '2026-10-27T10:00:00.000Z', 3),
    sugestao('cápsula', '2026-10-20T10:00:00.000Z'),
    sugestao('gotas', '2026-10-20T10:00:00.000Z'),
    sugestao('ml', '2026-10-20T10:00:00.000Z'),
  ],
  comoTomar: [
    sugestao('Com refeição', '2026-10-27T10:00:00.000Z', 2),
    sugestao('Em jejum', '2026-10-20T10:00:00.000Z'),
    sugestao('Tanto faz', '2026-10-20T10:00:00.000Z'),
  ],
  compromissos: [
    sugestao('Consulta', '2026-10-27T10:00:00.000Z', 2),
    sugestao('Exame', '2026-10-20T10:00:00.000Z'),
    sugestao('Visita', '2026-10-15T10:00:00.000Z'),
  ],
  tarefas: [
    sugestao('Lavar roupa', '2026-10-27T10:00:00.000Z', 2),
    sugestao('Regar plantas', '2026-10-20T10:00:00.000Z'),
    sugestao('Tirar o lixo', '2026-10-20T10:00:00.000Z'),
    sugestao('Limpar a casa', '2026-10-15T10:00:00.000Z'),
  ],
  participantes: [
    sugestao('Ana', '2026-10-27T10:00:00.000Z', 2),
    sugestao('Dr. Paulo', '2026-10-25T10:00:00.000Z'),
  ],
  locais: [
    sugestao('Clínica São José', '2026-10-27T10:00:00.000Z', 2),
    sugestao('UBS do bairro', '2026-10-15T10:00:00.000Z'),
  ],
  itensLevar: [
    sugestao('Exames anteriores', '2026-10-27T10:00:00.000Z'),
    sugestao('Cartão do SUS', '2026-10-15T10:00:00.000Z'),
  ],
  materiais: [
    sugestao('Sabão em pó', '2026-10-27T10:00:00.000Z', 2),
    sugestao('Balde', '2026-10-18T10:00:00.000Z'),
  ],
};
