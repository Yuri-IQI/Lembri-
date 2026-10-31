import * as Notifications from 'expo-notifications';
import { AndroidImportance, AndroidNotificationVisibility } from 'expo-notifications';
import { Platform } from 'react-native';

import { MINUTOS_ADIAR, type CategoriaNotificacao } from '@/utils/notificacoes';

export const CANAL = 'lembretes';
export const ACAO_FEITO = 'feito';
export const ACAO_ADIAR = 'adiar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BOTAO_FEITO: Record<CategoriaNotificacao, string> = { tomei: 'Tomei', fiz: 'Fiz' };

const criarCategoria = (categoria: CategoriaNotificacao) =>
  Notifications.setNotificationCategoryAsync(categoria, [
    {
      identifier: ACAO_FEITO,
      buttonTitle: BOTAO_FEITO[categoria],
      options: { opensAppToForeground: false },
    },
    {
      identifier: ACAO_ADIAR,
      buttonTitle: `Lembrar em ${MINUTOS_ADIAR} min`,
      options: { opensAppToForeground: false },
    },
  ]);

let preparo: Promise<unknown> | null = null;

/** Canal "Lembretes" e os botões das notificações; feito uma vez por execução do app. */
export const prepararAvisos = () => {
  preparo ??= Promise.all([
    Platform.OS === 'android' &&
      Notifications.setNotificationChannelAsync(CANAL, {
        name: 'Lembretes',
        description: 'Avisos na hora de cada lembrete',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      }),
    criarCategoria('tomei'),
    criarCategoria('fiz'),
  ]);
  return preparo;
};

/**
 * Pede permissão para notificar, se ainda não foi decidida. No Android o canal precisa existir
 * antes do pedido.
 */
export const pedirPermissaoNotificacoes = async (): Promise<boolean> => {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted || !atual.canAskAgain) return atual.granted;
  await prepararAvisos();
  return (await Notifications.requestPermissionsAsync()).granted;
};
