import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useVozStore } from '@/stores/useVozStore';
import type { ComandoVoz } from '@/types/comando-voz';

export const useComandosDeVoz = (comandos: ComandoVoz[]) => {
  const registrarComandos = useVozStore((state) => state.registrarComandos);
  const removerComandos = useVozStore((state) => state.removerComandos);

  useFocusEffect(
    useCallback(() => {
      registrarComandos(comandos);
      return () => removerComandos(comandos);
    }, [comandos, registrarComandos, removerComandos])
  );
};
