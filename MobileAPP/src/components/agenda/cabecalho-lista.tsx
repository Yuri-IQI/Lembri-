import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { DialogoLimite } from '@/components/forms/dialogo-limite';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { podeCriarLembrete, useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { plural } from '@/utils/texto';

type CabecalhoListaProps = {
  programados: number;
  pausados: number;
};

export const CabecalhoLista = ({ programados, pausados }: CabecalhoListaProps) => {
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
          {`${plural(programados, 'programado', 'programados')} · ${plural(pausados, 'pausado', 'pausados')}`}
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
