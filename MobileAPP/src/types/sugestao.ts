/** Campo do formulário que guarda valores já usados para sugerir de novo. */
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

/**
 * Valor já digitado num campo com sugestões.
 */
export interface Sugestao {
  /** Texto como a pessoa digitou na última vez. */
  valor: string;
  /** Data e hora do último uso, em ISO 8601. */
  usadoEm: string;
  /** Quantas vezes o valor foi salvo. */
  vezes: number;
}
