import { useState } from 'react';
import { Platform, StyleSheet, View, type GestureResponderEvent } from 'react-native';

import { FaixaGradiente } from '@/components/formulario/cor/faixa-gradiente';
import { BorderWidth, ComponentSize, Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SeletorMatizProps = {
  matiz: number;
  onAlterar: (matiz: number) => void;
};

const PASSO = 15;

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
      focusable
      accessibilityRole="adjustable"
      accessibilityLabel="Outra cor"
      accessibilityValue={{ min: 0, max: 360, now: matiz, text: `Matiz ${matiz} graus` }}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={matiz}
      aria-valuetext={`Matiz ${matiz} graus`}
      onKeyDown={Platform.OS === 'web' ? (event) => {
        const { key } = event.nativeEvent;
        if (key === 'ArrowLeft' || key === 'ArrowDown') {
          event.preventDefault();
          ajustar(-PASSO);
        } else if (key === 'ArrowRight' || key === 'ArrowUp') {
          event.preventDefault();
          ajustar(PASSO);
        } else if (key === 'Home' || key === 'End') {
          event.preventDefault();
          onAlterar(key === 'Home' ? 0 : 360);
        }
      } : undefined}
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
            left: (matiz / 360) * Math.max(0, largura - ComponentSize.marcadorMatiz),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  faixa: {
    height: TouchTarget,
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.hairline,
  },
  marcador: {
    position: 'absolute',
    width: ComponentSize.marcadorMatiz,
    height: TouchTarget,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thick,
  },
});
