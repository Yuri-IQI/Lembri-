import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Radius } from '@/constants/theme';
import { paradasDeMatizes } from '@/utils/cor/cor';

const PARADAS = paradasDeMatizes();

export const FaixaGradiente = () => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
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
