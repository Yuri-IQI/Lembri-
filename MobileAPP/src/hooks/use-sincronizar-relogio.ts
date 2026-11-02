import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { processarEventos } from '@/services/wear/processar-eventos';
import { publicarAgendaAtual } from '@/services/wear/sincronizar-agenda';
import { useLembretesStore } from '@/stores/useLembretesStore';

const publicar = () =>
  publicarAgendaAtual().catch((erro) =>
    console.warn('Não foi possível publicar a agenda do relógio', erro)
  );

/**
 * Mantém o relógio em dia: publica a agenda a cada mudança e, ao abrir ou voltar para o app,
 * também aplica o que o relógio deixou guardado. Só começa com as stores hidratadas.
 */
export const useSincronizarRelogio = (hidratado: boolean) => {
  const { lembretes, registros } = useLembretesStore(
    useShallow((state) => ({ lembretes: state.lembretes, registros: state.registros }))
  );

  useEffect(() => {
    if (hidratado) publicar();
  }, [hidratado, lembretes, registros]);

  useEffect(() => {
    if (!hidratado) return;
    const sincronizar = () => {
      publicar();
      processarEventos();
    };
    sincronizar();
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') sincronizar();
    });
    return () => assinatura.remove();
  }, [hidratado]);
};
