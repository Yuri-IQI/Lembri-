import type { AndroidSymbol } from 'expo-symbols';

/**
 * Níveis de dificuldade disponíveis para os exercícios cognitivos.
 */
export type NivelExercicio = 'facil' | 'medio' | 'dificil';

/**
 * Como a pessoa preenche as casas da rodada.
 */
export type ModoResposta = 'teclado' | 'opcoes';

/**
 * Uma rodada: o conjunto de itens memorizado e respondido de uma vez.
 */
export interface RodadaExercicio {
  /** Identificador estável da rodada dentro do exercício. */
  id: string;
  /** Rótulo do card (ex.: "SEQUÊNCIA", "ORDEM", "PAR", "LISTA"). */
  rotulo: string;
  /** Itens na ordem correta (ex.: ["80", "32", "12", "67", "55"]). */
  itens: string[];
  /** Dica mostrada em cada casa na resposta (Associações: a palavra-par). Mesmo tamanho de `itens`. */
  dicas?: string[];
  /** Opções erradas misturadas aos itens no modo `opcoes`. */
  distratores?: string[];
}

/**
 * Interface que define um exercício de estímulo cognitivo no Lembri.
 */
export interface Exercicio {
  /** Identificador único do exercício. */
  id: string;
  /** Título do exercício (ex: "Sequências", "Ordenação", "Associações", "Lista de compras"). */
  titulo: string;
  /** Subtítulo descritivo exibido na listagem e no cabeçalho do detalhe. */
  descricao: string;
  /** Parágrafos explicativos da seção de instruções. */
  instrucoes: string[];
  /** Nome do ícone Material para exibição no card e no detalhe. */
  icone: AndroidSymbol;
  /** Título motivacional da etapa de memorização (ex: "Lembre-se das Sequências!"). */
  tituloMemorizacao: string;
  /** Modo de entrada das respostas (teclado numérico ou seleção de chips). */
  modoResposta: ModoResposta;
  /** Lista de rodadas que compõem a execução do exercício. */
  rodadas: RodadaExercicio[];
  /** Nível de complexidade (mantido para compatibilidade de contrato). */
  nivel: NivelExercicio;
  /** Estimativa de tempo para conclusão em minutos (mantido para compatibilidade). */
  duracaoEstimadaMinutos: number;
}

/**
 * Registro de uma execução ou tentativa concluída de exercício pelo usuário.
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

/**
 * Sessão de execução em andamento (mantida estritamente em memória durante o fluxo).
 */
export interface SessaoExercicio {
  /** Identificador do exercício sendo executado. */
  exercicioId: string;
  /** Timestamp ISO 8601 do início da sessão. */
  inicio: string;
  /** Índice da rodada ativa no momento (base zero). */
  rodadaAtual: number;
  /** Matriz de respostas fornecidas por rodada e por casa. */
  respostas: string[][];
  /** Chips de opções embaralhados por rodada no modo 'opcoes'. */
  opcoes: string[][];
  /** Identificador da tentativa persistida ao concluir (assegura idempotência). */
  tentativaId: string | null;
}

/**
 * Resultado apurado de uma rodada individual (derivado em tempo de execução).
 */
export interface ResultadoRodada {
  /** Identificador da rodada avaliada. */
  rodadaId: string;
  /** Vetor booleano indicando acerto/erro por posição. */
  casas: boolean[];
  /** Total de itens corretos na rodada. */
  acertos: number;
  /** Total de itens presentes na rodada. */
  total: number;
  /** Percentual de acertos da rodada (0 a 100). */
  percentual: number;
}
