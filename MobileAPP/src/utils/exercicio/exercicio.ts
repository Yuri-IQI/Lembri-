import { descreverDia } from '@/stores/agenda-lembretes';
import type {
  Exercicio,
  NivelExercicio,
  ResultadoRodada,
  RodadaExercicio,
  SessaoExercicio,
  TentativaExercicio,
} from '@/types/exercicio';
import { chaveData, somarDias } from '@/utils/tempo/data';
import { formatarHora } from '@/utils/texto/texto';

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

export const historicoDoExercicio = (
  historico: TentativaExercicio[],
  exercicioId: string
): TentativaExercicio[] => {
  return [...historico.filter((item) => item.exercicioId === exercicioId)].sort(
    (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
  );
};

export interface EstatisticasExercicio {
  ultima?: Date;
  tempoMedioMin?: number;
  mediaAcertos?: number;
}

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

export interface AvaliacaoCasa {
  estado: 'correta' | 'lugar' | 'errada';
  direcao?: 'acima' | 'abaixo';
  posicaoCerta?: number;
}

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

export interface ResultadoSessao {
  rodadas: ResultadoRodada[];
  acertos: number;
  total: number;
  percentual: number;
}

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

export const formatarDuracao = (segundos: number): string => {
  const minutos = Math.max(1, Math.round(segundos / 60));
  return `${minutos} min`;
};
