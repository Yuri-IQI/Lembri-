import { StyleSheet, View } from 'react-native';

import { CasaItem } from '@/components/exercicio/casa-item';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { ResultadoRodada } from '@/types/exercicio';

export interface CartaoRodadaProps {
  rotulo: string;
  itens: string[];
  dicas?: string[];
  resultado?: ResultadoRodada;
  estadoPadrao?: 'neutra' | 'correta' | 'errada';
  mostrarPercentual?: boolean;
}

/**
 * Card padronizado para exibição de uma rodada de itens (Figma exercicios_preview, exercicios_res_err e exercicios_review).
 *
 * Utilizado tanto na fase de memorização (itens em estado neutro), quanto na correção
 * e no resumo final (com indicação visual por casa e percentual da rodada).
 */
export const CartaoRodada = ({
  rotulo,
  itens,
  dicas,
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
