import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';

/**
 * Pergunta antes de sair de um formulário com alterações, tanto pela seta da barra superior
 * quanto pelo botão voltar do Android.
 */
export const useSairSemSalvar = (sujo: boolean) => {
  const [confirmando, setConfirmando] = useState(false);

  const pedirSaida = useCallback(() => {
    if (sujo) setConfirmando(true);
    else router.back();
    return true;
  }, [sujo]);

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
        router.back();
      },
    },
  };
};
