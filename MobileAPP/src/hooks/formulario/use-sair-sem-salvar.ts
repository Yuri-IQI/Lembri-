import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';

/**
 * Pergunta antes de sair de um formulário ou sessão em andamento com alterações,
 * tanto pela seta da barra superior quanto pelo botão voltar do Android.
 *
 * @param sujo - Indica se há dados não salvos ou progresso a ser descartado.
 * @param aoSair - Callback opcional executado ao confirmar a saída (padrão: `router.back()`).
 */
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
