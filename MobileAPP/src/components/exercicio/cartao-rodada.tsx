import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CasaItem } from '@/components/exercicio/casa-item';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { ComponentSize, Spacing, type ThemeColor } from '@/constants/theme';
import type { ResultadoRodada } from '@/types/exercicio';
import { getBalancedCellWidth } from '@/utils/exercise-grid';

export interface CartaoRodadaProps {
  rotulo: string;
  itens: string[];
  dicas?: string[];
  cor?: ThemeColor;
  numerada?: boolean;
  /** Distribui os números sem deixar o último item isolado. */
  numeric?: boolean;
  resultado?: ResultadoRodada;
  estadoPadrao?: 'neutra' | 'correta' | 'errada';
  mostrarPercentual?: boolean;
}

/**
 * Card padronizado para exibição de uma rodada de itens (Figma exercicios_preview, exercicios_res_err e exercicios_review).
 *
 * Utilizado tanto na fase de memorização (itens em estado neutro), quanto na correção
 * e no resumo final (com indicação visual por casa e percentual da rodada).
 * Itens de texto usam duas colunas, preservando a mesma disposição na memorização e no resumo.
 */
export const CartaoRodada = ({
  rotulo,
  itens,
  dicas,
  cor,
  numerada = false,
  numeric = false,
  resultado,
  estadoPadrao = 'neutra',
  mostrarPercentual = false,
}: CartaoRodadaProps) => {
  const [availableWidth, setAvailableWidth] = useState(0);
  const gap = numeric ? Spacing.one : Spacing.two;
  const numericWidth = getBalancedCellWidth(itens.length, availableWidth, ComponentSize.exerciseNumberMinWidth, gap);
  const cellWidth = numeric ? numericWidth : Math.max(0, (availableWidth - gap) / 2);
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

      <View
        onLayout={(event) => setAvailableWidth(event.nativeEvent.layout.width)}
        style={[styles.fileiraItens, { gap }]}>
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
              numeric={numeric}
              style={{ width: cellWidth }}
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
    alignItems: 'stretch',
  },
});
