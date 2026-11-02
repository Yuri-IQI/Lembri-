import { descreverDia } from '@/stores/agenda-lembretes';
import type {
  Exercicio,
  NivelExercicio,
  ResultadoRodada,
  RodadaExercicio,
  SessaoExercicio,
  TentativaExercicio,
} from '@/types/exercicio';
import { chaveData, somarDias } from '@/utils/data';
import { formatarHora } from '@/utils/texto';

/**
 * Retorna a tentativa mais recente de um exercício dentro do histórico, independentemente
 * da ordem em que os itens estão dispostos no array.
 *
 * @param historico - Coleção de tentativas registradas.
 * @param exercicioId - Identificador do exercício buscado.
 * @returns A tentativa com maior dataHora ou undefined caso nenhuma seja encontrada.
 */
export const ultimaTentativa = (
  historico: TentativaExercicio[],
  exercicioId: string
): TentativaExercicio | undefined => {
  const tentativas = historico.filter((item) => item.exercicioId === exercicioId);
  if (tentativas.length === 0) {
    return undefined;
  }

  return tentativas.reduce((maisRecente, atual) => {
    const timeMaisRecente = new Date(maisRecente.dataHora).getTime();
    const timeAtual = new Date(atual.dataHora).getTime();
    return timeAtual > timeMaisRecente ? atual : maisRecente;
  });
};

/**
 * Gera a descrição legível e acessível da última atividade realizada de um exercício.
 *
 * @param tentativa - Tentativa mais recente ou undefined se nunca tiver sido praticado.
 * @param agora - Instância atual de Date de referência para cálculo relativo de dias.
 * @returns "Ainda não praticado" ou "Última atividade: ontem às 09:15".
 */
export const descreverUltimaAtividade = (
  tentativa: TentativaExercicio | undefined,
  agora: Date
): string => {
  if (!tentativa) {
    return 'Ainda não praticado';
  }

  const data = new Date(tentativa.dataHora);
  return `Última atividade: ${descreverDia(data, agora)} às ${formatarHora(data)}`;
};

/**
 * Formata o nível de complexidade do exercício para exibição amigável na interface.
 *
 * @param nivel - Identificador do nível de dificuldade.
 * @returns Rótulo capitalizado em português.
 */
export const formatarNivel = (nivel: NivelExercicio | Exercicio['nivel']): string => {
  switch (nivel) {
    case 'facil':
      return 'Fácil';
    case 'medio':
      return 'Médio';
    case 'dificil':
      return 'Difícil';
  }
};

/**
 * Calcula a sequência geral de dias consecutivos com pelo menos uma tentativa realizada (RN-EX-02).
 * Conta para trás a partir de hoje; se hoje ainda não houver tentativa, mantém a sequência até ontem.
 *
 * @param historico - Todas as tentativas concluídas persistidas.
 * @param agora - Instância de Date representando o momento atual.
 * @returns Quantidade de dias consecutivos da sequência ativa.
 */
export const calcularStreak = (historico: TentativaExercicio[], agora: Date): number => {
  if (historico.length === 0) {
    return 0;
  }

  const diasComTentativa = new Set(
    historico.map((item) => chaveData(new Date(item.dataHora)))
  );

  const hojeChave = chaveData(agora);
  const temHoje = diasComTentativa.has(hojeChave);

  let dataCursor = temHoje ? agora : somarDias(agora, -1);
  let streak = 0;

  while (diasComTentativa.has(chaveData(dataCursor))) {
    streak += 1;
    dataCursor = somarDias(dataCursor, -1);
  }

  return streak;
};

/**
 * Retorna as tentativas de um exercício ordenadas da mais recente para a mais antiga.
 *
 * @param historico - Todas as tentativas do usuário.
 * @param exercicioId - Identificador do exercício filtrado.
 * @returns Array ordenado com as tentativas do exercício.
 */
export const historicoDoExercicio = (
  historico: TentativaExercicio[],
  exercicioId: string
): TentativaExercicio[] => {
  return [...historico.filter((item) => item.exercicioId === exercicioId)].sort(
    (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
  );
};

/**
 * Estatísticas calculadas para a tela de detalhes de um exercício (RN-EX-07).
 */
export interface EstatisticasExercicio {
  ultima?: Date;
  tempoMedioMin?: number;
  mediaAcertos?: number;
}

/**
 * Calcula as métricas consolidadas (última data, tempo médio em minutos e média de acertos)
 * para a tela de detalhes de um exercício.
 *
 * @param historico - Todas as tentativas salvas.
 * @param exercicioId - Identificador do exercício.
 * @returns Objeto com as estatísticas apuradas ou campos indefinidos se não houver histórico.
 */
export const estatisticasDoExercicio = (
  historico: TentativaExercicio[],
  exercicioId: string
): EstatisticasExercicio => {
  const tentativas = historicoDoExercicio(historico, exercicioId);
  if (tentativas.length === 0) {
    return {
      ultima: undefined,
      tempoMedioMin: undefined,
      mediaAcertos: undefined,
    };
  }

  const ultima = new Date(tentativas[0].dataHora);
  const totalTempoSegundos = tentativas.reduce((acc, t) => acc + t.tempoGastoSegundos, 0);
  const totalPercentual = tentativas.reduce((acc, t) => acc + t.pontuacaoPercentual, 0);

  const mediaSegundos = totalTempoSegundos / tentativas.length;
  const tempoMedioMin = Math.max(1, Math.round(mediaSegundos / 60));
  const mediaAcertos = Math.round(totalPercentual / tentativas.length);

  return {
    ultima,
    tempoMedioMin,
    mediaAcertos,
  };
};

/**
 * Avalia as respostas fornecidas para uma rodada contra os itens oficiais (RN-EX-04 e RN-EX-05).
 *
 * @param rodada - Configuração da rodada do exercício.
 * @param respostas - Respostas inseridas pelo usuário nas casas.
 * @returns Resultado detalhado por casa e percentual de acerto.
 */
export const corrigirRodada = (
  rodada: RodadaExercicio,
  respostas: string[]
): ResultadoRodada => {
  const casas = rodada.itens.map((item, index) => {
    const resposta = (respostas[index] ?? '').trim().toLowerCase();
    return item.trim().toLowerCase() === resposta;
  });

  const acertos = casas.filter(Boolean).length;
  const total = rodada.itens.length;
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return {
    rodadaId: rodada.id,
    casas,
    acertos,
    total,
    percentual,
  };
};

/** Resultado de uma casa conferida: certa, de outra posição da rodada ou fora da rodada. */
export interface AvaliacaoCasa {
  estado: 'correta' | 'lugar' | 'errada';
  /** Só para números: de que lado do valor certo a resposta está. */
  direcao?: 'acima' | 'abaixo';
  /** Posição certa do item na rodada (a partir de 1), quando ele é de outra posição. */
  posicaoCerta?: number;
}

/**
 * Avalia uma casa da resposta contra os itens da rodada.
 *
 * @param resposta - Valor informado na casa.
 * @param indice - Posição da casa.
 * @param itens - Itens da rodada na ordem correta.
 * @param comDicas - Se falso, a casa informa só se está certa ou errada.
 * @returns Estado da casa e, para números errados, a direção em relação ao valor certo.
 */
export const avaliarCasa = (
  resposta: string,
  indice: number,
  itens: string[],
  comDicas = true
): AvaliacaoCasa => {
  const normalizar = (texto: string) => texto.trim().toLowerCase();
  const valor = normalizar(resposta);
  const alvo = normalizar(itens[indice] ?? '');
  if (valor === alvo) {
    return { estado: 'correta' };
  }
  if (!comDicas) {
    return { estado: 'errada' };
  }

  const indiceCerto = itens.findIndex((item) => normalizar(item) === valor);
  const estado = indiceCerto >= 0 ? 'lugar' : 'errada';
  const posicaoCerta = indiceCerto >= 0 ? indiceCerto + 1 : undefined;
  const numerico = /^\d+$/.test(valor) && /^\d+$/.test(alvo);
  return numerico
    ? { estado, posicaoCerta, direcao: Number(valor) > Number(alvo) ? 'acima' : 'abaixo' }
    : { estado, posicaoCerta };
};

/**
 * Resultado apurado da sessão inteira de um exercício.
 */
export interface ResultadoSessao {
  rodadas: ResultadoRodada[];
  acertos: number;
  total: number;
  percentual: number;
}

/**
 * Consolida o resultado de todas as rodadas de uma sessão concluída.
 *
 * @param exercicio - O exercício executado.
 * @param sessao - A sessão com as respostas registradas.
 * @returns Resultados individuais por rodada e totais consolidados.
 */
export const resultadoDaSessao = (
  exercicio: Exercicio,
  sessao: SessaoExercicio
): ResultadoSessao => {
  const rodadas = exercicio.rodadas.map((rodada, index) =>
    corrigirRodada(rodada, sessao.respostas[index] ?? [])
  );

  const acertos = rodadas.reduce((acc, r) => acc + r.acertos, 0);
  const total = rodadas.reduce((acc, r) => acc + r.total, 0);
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return {
    rodadas,
    acertos,
    total,
    percentual,
  };
};

/**
 * Embaralha uma lista utilizando o algoritmo Fisher-Yates de forma pura e imutável.
 * Permite injeção de gerador pseudoaleatório determinístico para execução de testes unitários.
 *
 * @param itens - Array de elementos a ser embaralhado.
 * @param aleatorio - Função que retorna um número entre 0 e 1 (padrão Math.random).
 * @returns Nova lista com os elementos em ordem embaralhada.
 */
export const embaralhar = <T>(
  itens: readonly T[],
  aleatorio: () => number = Math.random
): T[] => {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    const temp = copia[i];
    copia[i] = copia[j];
    copia[j] = temp;
  }
  return copia;
};

/**
 * Junta os exercícios do mesmo grupo, na posição do primeiro; os demais ficam sozinhos.
 *
 * @param exercicios - Catálogo de exercícios.
 * @returns Uma lista por card a exibir.
 */
export const agruparExercicios = (exercicios: Exercicio[]): Exercicio[][] => {
  const itens: Exercicio[][] = [];
  for (const exercicio of exercicios) {
    const doGrupo = exercicio.grupo
      ? itens.find(([primeiro]) => primeiro.grupo === exercicio.grupo)
      : undefined;
    if (doGrupo) {
      doGrupo.push(exercicio);
    } else {
      itens.push([exercicio]);
    }
  }
  return itens;
};

/**
 * Formata o tempo de duração em segundos para exibição compacta e amigável na interface.
 *
 * @param segundos - Duração em segundos.
 * @returns "5 min" ou "1 min".
 */
export const formatarDuracao = (segundos: number): string => {
  const minutos = Math.max(1, Math.round(segundos / 60));
  return `${minutos} min`;
};
