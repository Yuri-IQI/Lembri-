import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';

export const useSairSemSalvar = (sujo: boolean, aoSair?: () => void) => {
  const [confirmando, setConfirmando] = useState(false);

  const executarSaida = useCallback(() => {
    if (aoSair) {
      aoSair();
    } else {
      router.back();
    }
  }, [aoSair]);

  const pedirSaida = useCallback(() => {
    if (sujo) {
      setConfirmando(true);
    } else {
      executarSaida();
    }
    return true;
  }, [sujo, executarSaida]);

  useFocusEffect(
    useCallback(() => {
      const assinatura = BackHandler.addEventListener('hardwareBackPress', pedirSaida);
      return () => assinatura.remove();
    }, [pedirSaida])
  );

  return {
    pedirSaida,
    dialogo: {
      visivel: confirmando,
      onCancelar: () => setConfirmando(false),
      onConfirmar: () => {
        setConfirmando(false);
        executarSaida();
      },
    },
  };
};
