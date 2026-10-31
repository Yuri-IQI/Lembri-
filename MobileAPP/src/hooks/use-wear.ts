/**
 * Hook que expõe o estado da conexão com o relógio para as telas.
 *
 * Guarda em memória os lembretes enviados e marca como concluídos quando o
 * relógio confirma.
 */
import { useCallback, useEffect, useState } from 'react';

import type { Lembrete } from '@/services/wear/contrato';
import {
  enviarLembrete,
  listarRelogios,
  ouvirConfirmacoes,
  wearDisponivel,
  type RelogioConectado,
} from '@/services/wear/wear-service';

export type LembreteEnviado = Lembrete & { concluido: boolean };

export function useWear() {
  const [relogios, setRelogios] = useState<RelogioConectado[]>([]);
  const [lembretes, setLembretes] = useState<LembreteEnviado[]>([]);

  const atualizarRelogios = useCallback(async () => {
    setRelogios(await listarRelogios());
  }, []);

  // Ao montar: procura relógios e começa a ouvir confirmações.
  useEffect(() => {
    let ativo = true;
    listarRelogios().then((lista) => {
      if (ativo) setRelogios(lista); // ignora a resposta se a tela já desmontou
    });

    const pararDeOuvir = ouvirConfirmacoes(({ lembreteId }) => {
      setLembretes((atuais) =>
        atuais.map((l) => (l.id === lembreteId ? { ...l, concluido: true } : l)),
      );
      // PENDÊNCIA: lembretes deixaram de ter "concluído"; a confirmação do relógio deve virar um
      // registro de histórico ("Últimas vezes" do frame `detalhe lembrete`; Trello: "Marcar como
      // feito atualiza o histórico"). Até lá, ela só atualiza esta lista local.
    });

    return () => {
      ativo = false;
      pararDeOuvir();
    };
  }, []);

  /** Cria um lembrete e envia ao relógio. Retorna quantos relógios receberam. */
  const enviar = useCallback(async (titulo: string) => {
    const agora = new Date();
    const lembrete: Lembrete = {
      id: `${agora.getTime()}`,
      titulo,
      horario: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    const entregues = await enviarLembrete(lembrete);
    if (entregues > 0) {
      setLembretes((atuais) => [{ ...lembrete, concluido: false }, ...atuais]);
    }
    return entregues;
  }, []);

  return { disponivel: wearDisponivel, relogios, lembretes, enviar, atualizarRelogios };
}
