import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { plural } from '@/utils/texto';

type CabecalhoListaProps = {
  programados: number;
  pausados: number;
};

const novoLembrete = () =>
  router.push({ pathname: '/em-breve', params: { titulo: 'Novo lembrete' } });

export const CabecalhoLista = ({ programados, pausados }: CabecalhoListaProps) => (
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
  </View>
);

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
