import { useMemo, useState, type ReactNode } from 'react';
import { Animated, PanResponder, useWindowDimensions } from 'react-native';

type ArrastarParaRemoverProps = {
  children: ReactNode;
  chave: string;
  /** Recebe a `chave`; passe uma função estável (ex.: ação da store). */
  onRemover: (chave: string) => void;
};

const LIMIAR = 0.35;

/**
 * Arrastar o conteúdo para o lado tira ele da lista; soltando antes do limiar, ele volta.
 */
export const ArrastarParaRemover = ({ children, chave, onRemover }: ArrastarParaRemoverProps) => {
  const { width } = useWindowDimensions();
  const [x] = useState(() => new Animated.Value(0));

  const gesto = useMemo(() => {
    const voltar = () => Animated.spring(x, { toValue: 0, useNativeDriver: false }).start();
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => x.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) < width * LIMIAR) return voltar();
        Animated.timing(x, {
          toValue: Math.sign(g.dx) * width,
          duration: 200,
          useNativeDriver: false,
        }).start(() => onRemover(chave));
      },
      onPanResponderTerminate: voltar,
    });
  }, [x, width, chave, onRemover]);

  const opacity = x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateX: x }] }} {...gesto.panHandlers}>
      {children}
    </Animated.View>
  );
};
