export interface TipoLembrete {
  id: string;
  nome: string;
  corHex: string;
  icone?: string;
}

export interface CriarTipoLembreteInput {
  nome: string;
  corHex: string;
  icone?: string;
}
