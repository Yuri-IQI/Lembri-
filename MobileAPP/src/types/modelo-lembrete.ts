import type { AndroidSymbol } from 'expo-symbols';

import type { DiaSemana } from '@/types/lembrete';

/**
 * Modelo pré-definido que pré-preenche o rascunho de um lembrete (CARD-26).
 *
 * Facilita a criação rápida de lembretes comuns no Lembri (remédios, água, exercícios, tarefas).
 */
export interface ModeloLembrete {
  /** Identificador único do modelo. */
  id: string;
  /** Nome exibido na listagem de modelos. */
  nome: string;
  /** Material Symbol (Android) exibido no item da lista. */
  icone: AndroidSymbol;
  /** Título sugerido para o lembrete. */
  titulo: string;
  /** Tipo sugerido; ignorado se não existir mais na store. */
  tipoId?: string;
  /** Horários sugeridos (HH:mm, em ordem crescente). */
  horarios: string[];
  /** Dias sugeridos para repetição semanal. */
  dias: DiaSemana[];
  /** Descrição sugerida opcional. */
  descricao?: string;
}
