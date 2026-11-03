import * as Notifications from 'expo-notifications';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AvisoSucesso } from '@/components/feedback/aviso-sucesso';
import { Botao } from '@/components/controles/botao';
import { DialogoConfirmacao } from '@/components/feedback/dialogo-confirmacao';
import { GrupoCard } from '@/components/cards/grupo-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { apagarTodosOsDados } from '@/utils/dados/apagar-dados';

export const SecaoApagarDados = () => {
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  const apagar = () => {
    setConfirmando(false);
    apagarTodosOsDados();
    if (Platform.OS !== 'web') {
      Notifications.dismissAllNotificationsAsync().catch(() => undefined);
    }
    setAviso('Todos os dados foram apagados.');
  };

  return (
    <>
      <GrupoCard titulo="DADOS">
        <View style={styles.linha}>
          <ThemedText type="small" themeColor="textSecondary">
            Apaga deste aparelho seus lembretes, tipos, histórico de exercícios e ajustes.
          </ThemedText>
          <Botao
            rotulo="Apagar todos os dados"
            variante="perigo"
            onPress={() => setConfirmando(true)}
          />
        </View>
      </GrupoCard>
      <AvisoSucesso mensagem={aviso} onFechar={fecharAviso} />
      <DialogoConfirmacao
        visivel={confirmando}
        titulo="Apagar todos os dados?"
        mensagem="Seus lembretes, tipos, histórico de exercícios e ajustes serão apagados deste aparelho. Isso não pode ser desfeito."
        rotuloConfirmar="Apagar tudo"
        varianteConfirmar="perigo"
        onConfirmar={apagar}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  linha: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
});
