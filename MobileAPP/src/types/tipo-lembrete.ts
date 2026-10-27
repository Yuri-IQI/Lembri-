/**
 * Interface que define uma categoria/tipo de lembrete no aplicativo Lembri.
 */
export interface TipoLembrete {
  /** Identificador único do tipo. */
  id: string;
  /** Nome legível da categoria (ex: "Saúde", "Casa", "Trabalho", "Pessoal"). */
  nome: string;
  /** Código de cor hexadecimal acessível (contraste mínimo 7:1 sobre fundos claros). */
  corHex: string;
  /** Nome do ícone representativo opcional. */
  icone?: string;
}

/**
 * Dados de entrada para criação de uma categoria de lembrete.
 */
export interface CriarTipoLembreteInput {
  nome: string;
  corHex: string;
  icone?: string;
}
