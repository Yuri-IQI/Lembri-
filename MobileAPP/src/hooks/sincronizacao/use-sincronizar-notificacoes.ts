import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { sincronizarNotificacoes, type DadosNotificacao } from '@/utils/notificacoes/agendar-notificacoes';
import { notificacoesDesejadas } from '@/utils/notificacoes/notificacoes';
import { pedirPermissaoNotificacoes } from '@/utils/notificacoes/preparar-notificacoes';

export const useSincronizarNotificacoes = (hidratado: boolean) => {
  const { lembretes, registros } = useLembretesStore(
    useShallow((state) => ({ lembretes: state.lembretes, registros: state.registros }))
  );
  const avisosLigados = useSettingsStore((state) => state.reminderAlerts);
  const fila = useRef(Promise.resolve());

  useEffect(() => {
    if (!hidratado) return;
    const sincronizar = () => {
      const feitos = new Set(registros.map((registro) => registro.chave));
      const ativos = new Set(lembretes.filter((l) => l.ativo).map((l) => l.id));
      const manterAdiada = (dados: DadosNotificacao) =>
        avisosLigados && ativos.has(dados?.lembreteId) && !feitos.has(dados.ocorrencia);
      const desejadas = avisosLigados ? notificacoesDesejadas(lembretes, feitos, new Date()) : [];
      fila.current = fila.current
        .then(() => (desejadas.length > 0 ? pedirPermissaoNotificacoes() : false))
        .then(() => sincronizarNotificacoes(desejadas, manterAdiada))
        .catch((erro) => console.warn('Não foi possível agendar as notificações', erro));
    };

    sincronizar();
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') sincronizar();
    });
    return () => assinatura.remove();
  }, [hidratado, lembretes, registros, avisosLigados]);
};
