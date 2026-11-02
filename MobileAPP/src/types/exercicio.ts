import type { ThemeColor } from '@/constants/theme';

export type NivelExercicio = 'facil' | 'medio' | 'dificil';

export type ModoResposta = 'teclado' | 'opcoes';

export interface RodadaExercicio {
  id: string;
  rotulo: string;
  itens: string[];
  dicas?: string[];
  distratores?: string[];
  cor?: ThemeColor;
  numerada?: boolean;
}

export interface Exercicio {
  id: string;
  titulo: string;
  grupo?: string;
  descricao: string;
  instrucoes: string[];
  instrucaoDicas?: string;
  icone: 'associacao' | 'compras' | 'contexto' | 'guardar' | 'numeros' | 'ordem' | 'palavras' | 'sequencia';
  iconeGrupo?: Exercicio['icone'];
  tituloMemorizacao: string;
  modoResposta: ModoResposta;
  rodadas: RodadaExercicio[];
  nivel: NivelExercicio;
  duracaoEstimadaMinutos: number;
  somenteRelogio?: boolean;
}

export interface TentativaExercicio {
  id: string;
  exercicioId: string;
  dataHora: string;
  tempoGastoSegundos: number;
  acertos: number;
  totalQuestoes: number;
  pontuacaoPercentual: number;
  origem?: 'celular' | 'relogio';
}

export interface RegistrarTentativaInput {
  exercicioId: string;
  tempoGastoSegundos: number;
  acertos: number;
  totalQuestoes: number;
}

export interface SessaoExercicio {
  exercicioId: string;
  inicio: string;
  rodadaAtual: number;
  respostas: string[][];
  opcoes: string[][];
  tentativaId: string | null;
}

export interface ResultadoRodada {
  rodadaId: string;
  casas: boolean[];
  acertos: number;
  total: number;
  percentual: number;
}
