import { StyleSheet, View } from 'react-native';

import { CasaItem } from '@/components/exercicio/casa-item';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing, type ThemeColor } from '@/constants/theme';
import type { ResultadoRodada } from '@/types/exercicio';

export interface CartaoRodadaProps {
  rotulo: string;
  itens: string[];
  dicas?: string[];
  cor?: ThemeColor;
  numerada?: boolean;
  resultado?: ResultadoRodada;
  estadoPadrao?: 'neutra' | 'correta' | 'errada';
  mostrarPercentual?: boolean;
}

export const CartaoRodada = ({
  rotulo,
  itens,
  dicas,
  cor,
  numerada = false,
  resultado,
  estadoPadrao = 'neutra',
  mostrarPercentual = false,
}: CartaoRodadaProps) => {
  return (
    <Card style={styles.card}>
      <View style={styles.cabecalho}>
        <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
          {rotulo}
        </ThemedText>

        {mostrarPercentual && resultado !== undefined && (
          <ThemedText
            type="defaultBold"
            accessibilityLabel={`${resultado.percentual} porcento de acertos`}>
            {resultado.percentual}%
          </ThemedText>
        )}
      </View>

      <View style={styles.fileiraItens}>
        {itens.map((item, index) => {
          let estado = estadoPadrao;
          if (resultado) {
            estado = resultado.casas[index] ? 'correta' : 'errada';
          }

          return (
            <CasaItem
              key={`${item}-${index}`}
              valor={item}
              estado={estado}
              dica={dicas ? dicas[index] : undefined}
              cor={cor}
              ordem={numerada ? index + 1 : undefined}
            />
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileiraItens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
