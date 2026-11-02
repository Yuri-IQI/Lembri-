import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { Colors, LoadingEclipse } from '@/constants/theme';

const { deslocamentoSombra, movimentoMs, opacidadePonto, pausaMs, pulsoMs } = LoadingEclipse;

const mover = (valor: Animated.Value, destino: number, duration: number) =>
  Animated.timing(valor, {
    toValue: destino,
    duration,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  });

const animarSombra = (sombra: Animated.Value) =>
  Animated.loop(
    Animated.sequence([
      mover(sombra, 0, movimentoMs),
      Animated.delay(pausaMs),
      mover(sombra, deslocamentoSombra, movimentoMs),
      mover(sombra, 0, movimentoMs),
      Animated.delay(pausaMs),
      mover(sombra, -deslocamentoSombra, movimentoMs),
    ])
  );

const animarPonto = (ponto: Animated.Value) =>
  Animated.loop(
    Animated.sequence([mover(ponto, 1, pulsoMs), mover(ponto, opacidadePonto, pulsoMs)])
  );

/** Sombra passando sobre a lua. Com "Reduzir movimento", fica parada no centro (WCAG 2.3.3). */
export const Eclipse = () => {
  const [sombra] = useState(() => new Animated.Value(0));
  const [ponto] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let montado = true;
    let animacoes: Animated.CompositeAnimation[] = [];
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduzir) => {
        if (!montado || reduzir) return;
        sombra.setValue(-deslocamentoSombra);
        ponto.setValue(opacidadePonto);
        animacoes = [animarSombra(sombra), animarPonto(ponto)];
        animacoes.forEach((animacao) => animacao.start());
      });
    return () => {
      montado = false;
      animacoes.forEach((animacao) => animacao.stop());
    };
  }, [sombra, ponto]);

  return (
    <View style={styles.arte} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={[styles.circulo, styles.lua]} />
      <Animated.View
        style={[
          styles.circulo,
          styles.sombra,
          { transform: [{ translateX: sombra }, { translateY: sombra }] },
        ]}
      />
      <Animated.View style={[styles.ponto, { opacity: ponto }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  arte: {
    width: LoadingEclipse.arte,
    height: LoadingEclipse.arte,
    overflow: 'hidden',
  },
  circulo: {
    position: 'absolute',
    left: LoadingEclipse.luaInicio,
    top: LoadingEclipse.luaInicio,
    width: LoadingEclipse.lua,
    height: LoadingEclipse.lua,
    borderRadius: LoadingEclipse.lua / 2,
  },
  lua: {
    backgroundColor: Colors.loadingLua,
  },
  sombra: {
    backgroundColor: Colors.loadingSombra,
  },
  ponto: {
    position: 'absolute',
    left: LoadingEclipse.pontoEsquerda,
    top: LoadingEclipse.pontoTopo,
    width: LoadingEclipse.ponto,
    height: LoadingEclipse.ponto,
    borderRadius: LoadingEclipse.ponto / 2,
    backgroundColor: Colors.loadingPonto,
  },
});
