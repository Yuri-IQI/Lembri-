import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CirculoCor } from '@/components/formulario/circulo-cor';
import { SeletorMatiz } from '@/components/formulario/seletor-matiz';
import { ThemedText } from '@/components/themed-text';
import { PaletaTipos, Spacing, TouchTarget } from '@/constants/theme';
import { corLegivelDoMatiz, matizDaCor } from '@/utils/cor';

export type SeletorCorProps = {
  rotulo: string;
  valor: string;
  onAlterar: (corHex: string) => void;
};

const mesmaCor = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Seletor de cores acessível com alto contraste para categorias e tipos de lembrete (CARD-26):
 * uma linha só de cores prontas (as que couberem) e, abaixo, a faixa com todas as cores.
 *
 * Características de acessibilidade WCAG 2.2 AAA:
 * - Círculos tocáveis com dimensão mínima TouchTarget = 56dp (Critério 2.5.5);
 * - Toda cor tem contraste >= 7:1 contra o texto principal (Critério 1.4.6);
 * - Indicador de check com corDeTextoLegivel para não depender somente da cor (Critério 1.4.1);
 * - Papel semântico accessibilityRole="radio" com anúncio do nome da cor.
 */
export const SeletorCor = ({ rotulo, valor, onAlterar }: SeletorCorProps) => {
  const naPaleta = PaletaTipos.some((cor) => mesmaCor(cor.corHex, valor));
  const [matiz, setMatiz] = useState(() => (naPaleta ? 0 : matizDaCor(valor)));
  const [largura, setLargura] = useState(0);
  const cabem = Math.max(1, Math.floor((largura + Spacing.two) / (TouchTarget + Spacing.two)));

  const prontas = PaletaTipos.slice(0, naPaleta ? cabem : cabem - 1);
  const escolhidaFora = naPaleta && !prontas.some((cor) => mesmaCor(cor.corHex, valor));
  const linha = [
    ...(escolhidaFora ? prontas.slice(0, -1) : prontas),
    ...PaletaTipos.filter((cor) => escolhidaFora && mesmaCor(cor.corHex, valor)),
    ...(naPaleta ? [] : [{ nome: 'escolhida na faixa', corHex: valor }]),
  ];

  return (
    <View style={styles.container}>
      {rotulo ? <ThemedText type="label">{rotulo}</ThemedText> : null}
      <View style={styles.linha} onLayout={(evento) => setLargura(evento.nativeEvent.layout.width)}>
        {largura > 0 &&
          linha.map((cor) => (
            <CirculoCor
              key={cor.corHex}
              corHex={cor.corHex}
              nome={cor.nome}
              selecionado={mesmaCor(cor.corHex, valor)}
              onPress={() => onAlterar(cor.corHex)}
            />
          ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Ou toque na faixa para escolher outra cor:
      </ThemedText>
      <SeletorMatiz
        matiz={matiz}
        onAlterar={(novo) => {
          setMatiz(novo);
          onAlterar(corLegivelDoMatiz(novo));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  linha: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
