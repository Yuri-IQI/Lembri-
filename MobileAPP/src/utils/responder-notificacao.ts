import type * as Notifications from 'expo-notifications';

import { publicarAgendaAtual } from '@/services/wear/sincronizar-agenda';
import { useLembretesStore } from '@/stores/useLembretesStore';
import {
  adiarNotificacao,
  encerrarOcorrencia,
  type DadosNotificacao,
} from '@/utils/agendar-notificacoes';
import { esperarHidratacao } from '@/utils/esperar-hidratacao';
import { ocorrenciaDaChave } from '@/utils/notificacoes';
import { ACAO_ADIAR, ACAO_FEITO } from '@/utils/preparar-notificacoes';

type ConteudoRecebido = { data?: unknown; dataString?: string };

const ehDados = (dados: unknown): dados is DadosNotificacao =>
  !!dados && typeof dados === 'object' && 'ocorrencia' in dados;

/** Na tarefa em segundo plano do Android os dados chegam como texto JSON em `dataString`. */
const lerDados = (notificacao: Notifications.Notification): DadosNotificacao | null => {
  const conteudo = notificacao.request.content as ConteudoRecebido;
  if (ehDados(conteudo.data)) return conteudo.data;
  const lidos: unknown = conteudo.dataString ? JSON.parse(conteudo.dataString) : null;
  return ehDados(lidos) ? lidos : null;
};

/**
 * Trata o toque na notificação ou num botão dela. "Tomei"/"Fiz" marca o horário como feito;
 * "Lembrar em 10 min" adia. Retorna o lembrete a abrir quando a pessoa tocou na notificação.
 */
export const responderNotificacao = async (
  resposta: Notifications.NotificationResponse
): Promise<string | null> => {
  const notificacao = resposta.notification;
  const dados = lerDados(notificacao);
  if (!dados) return null;

  if (resposta.actionIdentifier === ACAO_ADIAR) {
    await adiarNotificacao(notificacao, dados);
    return null;
  }
  if (resposta.actionIdentifier === ACAO_FEITO) {
    await esperarHidratacao(useLembretesStore);
    const { lembretes, marcarFeito } = useLembretesStore.getState();
    const ocorrencia = ocorrenciaDaChave(dados.ocorrencia, lembretes);
    if (ocorrencia) marcarFeito(ocorrencia);
    await encerrarOcorrencia(notificacao, dados);
    await publicarAgendaAtual().catch((erro) =>
      console.warn('Não foi possível publicar a agenda do relógio', erro)
    );
    return null;
  }
  return dados.lembreteId;
};
