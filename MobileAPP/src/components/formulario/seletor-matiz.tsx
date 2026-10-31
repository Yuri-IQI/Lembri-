import { useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';

import { FaixaGradiente } from '@/components/formulario/faixa-gradiente';
import { BorderWidth, ComponentSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SeletorMatizProps = {
  /** Matiz escolhido, de 0 a 360. */
  matiz: number;
  onAlterar: (matiz: number) => void;
};

const PASSO = 15;

/**
 * Faixa com todas as cores: tocar ou arrastar escolhe o matiz. No leitor de tela, deslizar para
 * cima e para baixo muda a cor de 15 em 15 graus.
 */
export const SeletorMatiz = ({ matiz, onAlterar }: SeletorMatizProps) => {
  const theme = useTheme();
  const [largura, setLargura] = useState(0);

  const escolher = (evento: GestureResponderEvent) => {
    if (largura === 0) return;
    const x = Math.min(Math.max(evento.nativeEvent.locationX, 0), largura);
    onAlterar(Math.round((x / largura) * 360));
  };

  const ajustar = (delta: number) => onAlterar((matiz + delta + 360) % 360);

  return (
    <View
      style={[styles.faixa, { borderColor: theme.border }]}
      onLayout={(evento) => setLargura(evento.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={escolher}
      onResponderMove={escolher}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Outra cor"
      accessibilityValue={{ min: 0, max: 360, now: matiz, text: `Matiz ${matiz} graus` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(evento) =>
        ajustar(evento.nativeEvent.actionName === 'increment' ? PASSO : -PASSO)
      }>
      <FaixaGradiente />
      <View
        pointerEvents="none"
        style={[
          styles.marcador,
          {
            borderColor: theme.primary,
            left: (matiz / 360) * largura - ComponentSize.marcadorMatiz / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  faixa: {
    height: ComponentSize.faixaMatiz,
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.hairline,
  },
  marcador: {
    position: 'absolute',
    width: ComponentSize.marcadorMatiz,
    height: ComponentSize.faixaMatiz + 8,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thick,
  },
});
