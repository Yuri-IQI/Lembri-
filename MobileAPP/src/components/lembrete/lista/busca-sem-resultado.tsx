import { StyleSheet } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type BuscaSemResultadoProps = {
  busca: string;
  comFiltros: boolean;
  onLimpar: () => void;
};

export const BuscaSemResultado = ({ busca, comFiltros, onLimpar }: BuscaSemResultadoProps) => (
  <Card style={styles.card}>
    <ThemedText type="subheading">Nenhum lembrete encontrado</ThemedText>
    <ThemedText type="small" themeColor="textSecondary">
      {comFiltros
        ? 'Não há resultados com os filtros escolhidos.'
        : `Não há resultados para “${busca}”.`}
    </ThemedText>
    <Botao
      rotulo={comFiltros ? 'Limpar busca e filtros' : 'Limpar busca'}
      variante="secundario"
      accessibilityLabel={comFiltros ? 'Limpar busca e filtros' : 'Limpar termo de busca'}
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
