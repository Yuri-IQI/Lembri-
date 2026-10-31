import type { CriarLembreteInput } from '@/types/lembrete';
import type { ModeloLembrete } from '@/types/modelo-lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';

/**
 * Converte um modelo pré-definido em um rascunho de dados de entrada para criação de lembrete.
 *
 * Garante imutabilidade estrita criando cópias defensivas dos arrays de horários e dias,
 * e verifica se o tipoId referenciado no modelo existe nos tipos cadastrados (RN-04).
 * Se o tipo tiver sido removido ou não existir, o campo tipoId resultante será undefined.
 *
 * @param modelo - Modelo base selecionado.
 * @param tiposExistentes - Lista de tipos de lembrete cadastrados na store.
 * @returns Rascunho CriarLembreteInput pronto para edição ou salvamento.
 */
export const rascunhoDeModelo = (
  modelo: ModeloLembrete,
  tiposExistentes: TipoLembrete[]
): CriarLembreteInput => {
  const tipoValido = modelo.tipoId
    ? tiposExistentes.some((t) => t.id === modelo.tipoId)
    : false;

  return {
    titulo: modelo.titulo,
    horarios: [...modelo.horarios],
    dias: [...modelo.dias],
    tipoId: tipoValido ? modelo.tipoId : undefined,
    ...(modelo.descricao ? { descricao: modelo.descricao } : {}),
  };
};
