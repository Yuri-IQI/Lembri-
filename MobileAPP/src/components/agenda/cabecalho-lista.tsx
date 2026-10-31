import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { DialogoLimite } from '@/components/forms/dialogo-limite';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { podeCriarLembrete, useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

type CabecalhoListaProps = {
  /** Linha de contagem abaixo do título (ex.: "4 programados · 1 pausado"). */
  resumo: string;
};

export const CabecalhoLista = ({ resumo }: CabecalhoListaProps) => {
  const total = useLembretesStore((state) => state.lembretes.length);
  const limite = useSettingsStore((state) => state.reminderLimit);
  const [noLimite, setNoLimite] = useState(false);

  const novoLembrete = () => {
    if (podeCriarLembrete(total, limite)) router.push('/lembrete/novo');
    else setNoLimite(true);
  };

  return (
    <View style={styles.linha}>
      <View style={styles.textos}>
        <ThemedText type="title" accessibilityRole="header">
          Seus Lembretes
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {resumo}
        </ThemedText>
      </View>
      <BotaoIcone icone="add" accessibilityLabel="Criar novo lembrete" onPress={novoLembrete} />
      <DialogoLimite visivel={noLimite} onFechar={() => setNoLimite(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  textos: {
    flex: 1,
  },
});
