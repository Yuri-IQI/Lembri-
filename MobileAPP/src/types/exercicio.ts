/**
 * Níveis de dificuldade disponíveis para os exercícios cognitivos.
 */
export type NivelExercicio = 'facil' | 'medio' | 'dificil';

/**
 * Interface que define um exercício de estímulo cognitivo no Lembri.
 */
export interface Exercicio {
  /** Identificador único do exercício. */
  id: string;
  /** Título do exercício (ex: "Sequências", "Ordenação", "Associações", "Lista de compras"). */
  titulo: string;
  /** Descrição explicativa do objetivo do exercício. */
  descricao: string;
  /** Sequência atual de dias consecutivos de realização (streak). */
  streakDias: number;
  /** Nível de complexidade. */
  nivel: NivelExercicio;
  /** Estimativa de tempo para conclusão em minutos. */
  duracaoEstimadaMinutos: number;
  /** Nome ou identificador do ícone temático. */
  icone: string;
}

/**
 * Registro de uma execução ou tentativa de exercício pelo usuário.
 */
export interface TentativaExercicio {
  /** Identificador único da tentativa. */
  id: string;
  /** Identificador do exercício executado. */
  exercicioId: string;
  /** Timestamp da realização no formato ISO 8601. */
  dataHora: string;
  /** Tempo total consumido na execução em segundos. */
  tempoGastoSegundos: number;
  /** Quantidade de respostas corretas obtidas. */
  acertos: number;
  /** Quantidade total de perguntas ou etapas do exercício. */
  totalQuestoes: number;
  /** Pontuação percentual calculada (0 a 100). */
  pontuacaoPercentual: number;
}

/**
 * Dados de entrada para registrar a conclusão de uma tentativa de exercício.
 */
export interface RegistrarTentativaInput {
  exercicioId: string;
  tempoGastoSegundos: number;
  acertos: number;
  totalQuestoes: number;
}
