import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const criarLembrete = () => router.push('/lembrete/novo');

export const AgendaVazia = () => (
  <Card style={styles.vazio}>
    <ThemedText type="subheading">Nenhum lembrete</ThemedText>
    <ThemedText type="small" themeColor="textSecondary">
      Crie seu primeiro lembrete para ele aparecer aqui.
    </ThemedText>
    <Botao rotulo="Criar lembrete" onPress={criarLembrete} style={styles.botao} />
  </Card>
);

const styles = StyleSheet.create({
  vazio: {
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  botao: {
    alignSelf: 'stretch',
  },
});
