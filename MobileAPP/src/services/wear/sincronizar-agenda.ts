import { useLembretesStore } from '@/stores/useLembretesStore';

import { VERSAO_CONTRATO } from './contrato';
import { montarAgenda } from './montar-agenda';
import { publicarAgenda } from './wear-service';

let ultimaPublicada = '';

/** Publica a agenda atual; não republica se os lembretes não mudaram, para poupar a bateria. */
export const publicarAgendaAtual = async () => {
  const { lembretes, registros } = useLembretesStore.getState();
  const agora = new Date();
  const agenda = montarAgenda(lembretes, registros, agora);
  const conteudo = JSON.stringify(agenda);
  if (conteudo === ultimaPublicada) return;
  await publicarAgenda({
    v: VERSAO_CONTRATO,
    geradoEm: agora.toISOString(),
    lembretes: agenda,
  });
  ultimaPublicada = conteudo;
};
