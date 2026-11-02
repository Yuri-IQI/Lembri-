import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CirculoCor } from '@/components/formulario/cor/circulo-cor';
import { SeletorMatiz } from '@/components/formulario/cor/seletor-matiz';
import { ThemedText } from '@/components/themed-text';
import { PaletaTipos, Spacing, TouchTarget } from '@/constants/theme';
import { corLegivelDoMatiz, matizDaCor } from '@/utils/cor/cor';

export type SeletorCorProps = {
  rotulo: string;
  valor: string;
  onAlterar: (corHex: string) => void;
};

const mesmaCor = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

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
