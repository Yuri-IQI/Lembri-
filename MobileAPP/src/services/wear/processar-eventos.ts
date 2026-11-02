import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { cancelarAvisosDaOcorrencia } from '@/utils/notificacoes/agendar-notificacoes';
import { esperarHidratacao } from '@/utils/dados/esperar-hidratacao';
import { ocorrenciaDaChave } from '@/utils/notificacoes/notificacoes';

import type { EventoRelogio } from './contrato';
import { lerEvento } from './ler-evento';
import { publicarAgendaAtual } from './sincronizar-agenda';
import { confirmarEvento, listarEventos } from './wear-service';

const aplicarFeito = async (evento: Extract<EventoRelogio, { tipo: 'feito' }>) => {
  const { lembretes, marcarFeito } = useLembretesStore.getState();
  const ocorrencia = ocorrenciaDaChave(evento.chave, lembretes);
  if (!ocorrencia) return;
  marcarFeito(ocorrencia, { origem: 'relogio', feitoEm: evento.feitoEm });
  await cancelarAvisosDaOcorrencia(evento.chave);
};

const aplicarExercicio = (evento: Extract<EventoRelogio, { tipo: 'exercicio' }>, uri: string) => {
  const { acertos, total } = evento;
  useExerciciosStore.getState().registrarTentativaRelogio({
    id: `relogio-${uri.split('/').pop()}`,
    exercicioId: evento.exercicioId,
    dataHora: evento.iniciadaEm,
    tempoGastoSegundos: evento.duracaoSeg,
    acertos,
    totalQuestoes: total,
    pontuacaoPercentual: total > 0 ? Math.round((acertos / total) * 100) : 0,
  });
};

const processar = async () => {
  const dados = await listarEventos();
  if (dados.length === 0) return;
  await Promise.all([
    esperarHidratacao(useLembretesStore),
    esperarHidratacao(useExerciciosStore),
  ]);

  for (const { uri, payload } of dados) {
    const evento = lerEvento(payload);
    if (evento?.tipo === 'feito') await aplicarFeito(evento);
    if (evento?.tipo === 'exercicio') aplicarExercicio(evento, uri);
  }
  await publicarAgendaAtual();
  // Aviso: apagar só depois de aplicar. Se algo falhar antes, o evento é processado de novo.
  for (const { uri } of dados) await confirmarEvento(uri);
};

let fila = Promise.resolve();

export const processarEventos = () => {
  fila = fila
    .then(processar)
    .catch((erro) => console.warn('Não foi possível processar os eventos do relógio', erro));
  return fila;
};
