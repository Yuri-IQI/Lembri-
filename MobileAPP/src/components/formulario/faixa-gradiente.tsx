import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Radius } from '@/constants/theme';
import { paradasDeMatizes } from '@/utils/cor';

const PARADAS = paradasDeMatizes();

/**
 * Gradiente horizontal com todas as cores legíveis, preenchendo o elemento pai.
 */
export const FaixaGradiente = () => (
  <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <LinearGradient id="matizes" x1="0" y1="0" x2="1" y2="0">
        {PARADAS.map((parada) => (
          <Stop key={parada.posicao} offset={parada.posicao} stopColor={parada.cor} />
        ))}
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" rx={Radius.lg} fill="url(#matizes)" />
  </Svg>
);
