import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { TentativaExercicio } from '@/types/exercicio';
import { formatarData } from '@/utils/tempo/data';
import { formatarDuracao } from '@/utils/exercicio/exercicio';

export interface HistoricoTentativasProps {
  tentativas: TentativaExercicio[];
}

export const HistoricoTentativas = ({ tentativas }: HistoricoTentativasProps) => {
  return (
    <Card style={styles.card}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        HISTÓRICO DE TENTATIVAS
      </ThemedText>

      {tentativas.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          Você ainda não fez este exercício.
        </ThemedText>
      ) : (
        <View style={styles.lista}>
          {tentativas.map((item) => {
            const dataFormatada = formatarData(item.dataHora.split('T')[0]);
            const duracaoTexto = formatarDuracao(item.tempoGastoSegundos);
            const noRelogio = item.origem === 'relogio';
            const descricao = `${dataFormatada} · ${item.acertos} de ${item.totalQuestoes} acertos · ${duracaoTexto}${noRelogio ? ' · Relógio' : ''}`;
            const labelAcessivel = `Tentativa em ${dataFormatada}${noRelogio ? ', feita no relógio' : ''}: ${item.acertos} de ${item.totalQuestoes} acertos (${item.pontuacaoPercentual}%), concluída em ${duracaoTexto}`;

            return (
              <View
                key={item.id}
                style={styles.item}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={labelAcessivel}>
                <ThemedText type="smallBold">{descricao}</ThemedText>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  lista: {
    gap: Spacing.two,
  },
  item: {
    paddingVertical: Spacing.one,
  },
});
