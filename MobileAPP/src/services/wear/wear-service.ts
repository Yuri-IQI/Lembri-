/**
 * Serviço de comunicação com o relógio (camada de domínio).
 *
 * Camadas, de baixo para cima:
 *   modules/wear-connector (nativo)  → transporte genérico: path + texto
 *   src/services/wear (este arquivo) → regras do Lembri: paths, JSON, tipos
 *
 * As telas nunca importam o módulo nativo diretamente.
 */
import WearConnector, { type DadoGuardado } from '@modules/wear-connector';

import { Paths, type AgendaRelogio } from './contrato';

export const publicarAgenda = async (agenda: AgendaRelogio): Promise<void> => {
  await WearConnector?.publicarDado(Paths.AGENDA, JSON.stringify(agenda));
};

export const listarEventos = async (): Promise<DadoGuardado[]> =>
  (await WearConnector?.listarDados(Paths.EVENTOS)) ?? [];

export const confirmarEvento = async (uri: string): Promise<void> => {
  await WearConnector?.apagarDado(uri);
};
