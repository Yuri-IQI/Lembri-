import { StyleSheet } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type BuscaSemResultadoProps = {
  busca: string;
  onLimpar: () => void;
};

/**
 * Aviso exibido quando a busca não encontra nenhum lembrete.
 */
export const BuscaSemResultado = ({ busca, onLimpar }: BuscaSemResultadoProps) => (
  <Card style={styles.card}>
    <ThemedText type="subheading">Nenhum lembrete encontrado</ThemedText>
    <ThemedText type="small" themeColor="textSecondary">
      Não há resultados para &ldquo;{busca}&rdquo;.
    </ThemedText>
    <Botao
      rotulo="Limpar busca"
      variante="secundario"
      accessibilityLabel="Limpar termo de busca"
      onPress={onLimpar}
      style={styles.botao}
    />
  </Card>
);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  botao: {
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
});
