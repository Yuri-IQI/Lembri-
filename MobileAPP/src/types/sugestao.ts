export type FonteSugestao =
  | 'remedios'
  | 'unidades'
  | 'comoTomar'
  | 'compromissos'
  | 'tarefas'
  | 'participantes'
  | 'locais'
  | 'itensLevar'
  | 'materiais';

export interface Sugestao {
  valor: string;
  usadoEm: string;
  vezes: number;
}
