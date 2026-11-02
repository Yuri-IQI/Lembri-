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
