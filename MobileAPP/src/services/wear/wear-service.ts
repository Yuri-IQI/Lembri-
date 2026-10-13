/**
 * Serviço de comunicação com o relógio (camada de domínio).
 *
 * Camadas, de baixo para cima:
 *   modules/wear-connector (nativo)  → transporte genérico: path + texto
 *   src/services/wear (este arquivo) → regras do Lembri: paths, JSON, tipos
 *   src/hooks/use-wear.ts            → estado React para as telas
 *
 * As telas nunca importam o módulo nativo diretamente.
 */
import WearConnector, { type RelogioConectado } from '@modules/wear-connector';

import { CAPABILITY_WEAR, Paths, type Confirmacao, type Lembrete } from './contrato';

export type { RelogioConectado };

/** `false` no iOS, web e Expo Go: nesses casos as funções viram no-op. */
export const wearDisponivel = WearConnector != null;

export async function listarRelogios(): Promise<RelogioConectado[]> {
  if (!WearConnector) return [];
  try {
    return await WearConnector.listarRelogios(CAPABILITY_WEAR);
  } catch (erro) {
    console.warn('[wear] falha ao listar relógios', erro);
    return [];
  }
}

/**
 * Envia um lembrete para TODOS os relógios conectados.
 * @returns quantos relógios receberam a mensagem.
 */
export async function enviarLembrete(lembrete: Lembrete): Promise<number> {
  if (!WearConnector) return 0;
  const relogios = await listarRelogios();
  const payload = JSON.stringify(lembrete);

  const resultados = await Promise.allSettled(
    relogios.map((r) => WearConnector!.enviarMensagem(r.id, Paths.LEMBRETE, payload)),
  );
  return resultados.filter((r) => r.status === 'fulfilled').length;
}

/**
 * Escuta confirmações vindas do relógio.
 * @returns função para cancelar a inscrição (use no cleanup do useEffect).
 */
export function ouvirConfirmacoes(callback: (confirmacao: Confirmacao) => void): () => void {
  if (!WearConnector) return () => {};

  const inscricao = WearConnector.addListener('onMensagemRecebida', ({ path, payload }) => {
    if (path !== Paths.CONFIRMACAO) return;
    try {
      callback(JSON.parse(payload) as Confirmacao);
    } catch (erro) {
      console.warn('[wear] payload de confirmação inválido', payload, erro);
    }
  });
  return () => inscricao.remove();
}
