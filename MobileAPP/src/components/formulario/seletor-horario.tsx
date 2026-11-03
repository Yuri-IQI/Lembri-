import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ajustarHorario } from '@/utils/horario';

export type SeletorHorarioProps = {
  rotulo?: string;
  valor: string;
  onAlterar: (horario: string) => void;
  passoMinutos?: number;
};

/** Mantém as setas do teclado equivalentes aos botões de incremento e decremento na web. */
const keyboardAdjustment = (adjust: (delta: number) => void): NonNullable<ViewProps['onKeyDown']> => (event) => {
  const { key } = event.nativeEvent;
  if (key === 'ArrowUp' || key === 'ArrowRight') {
    event.preventDefault();
    adjust(1);
  } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
    event.preventDefault();
    adjust(-1);
  }
};

/**
 * Seletor de horário grande e acessível com controle por dígitos e botões +/− (CARD-26).
 *
 * Características de acessibilidade WCAG 2.2 AAA:
 * - Botões de incremento e decremento com dimensões mínimas TouchTarget = 56dp;
 * - Suporte a leitores de tela com accessibilityRole="adjustable", gestures de swipe
 *   (accessibilityActions increment/decrement) e anúncio contextual em linguagem natural;
 * - Fechamento circular isolado (wrap) de horas e minutos em passos customizáveis.
 */
export const SeletorHorario = ({
  rotulo,
  valor,
  onAlterar,
  passoMinutos = 5,
}: SeletorHorarioProps) => {
  const theme = useTheme();

  const horarioNormalizado = ajustarHorario(valor, 'hora', 0, passoMinutos);
  const [hora, minuto] = horarioNormalizado.split(':');

  const alterarHora = (delta: number) => {
    onAlterar(ajustarHorario(horarioNormalizado, 'hora', delta, passoMinutos));
  };

  const alterarMinuto = (delta: number) => {
    onAlterar(ajustarHorario(horarioNormalizado, 'minuto', delta, passoMinutos));
  };

  return (
    <View style={styles.container}>
      {rotulo ? <ThemedText type="label">{rotulo}</ThemedText> : null}

      <View style={styles.linhaSeletor}>
        {/* Coluna de Horas */}
        <View style={styles.coluna}>
          <BotaoIcone
            icone="add"
            accessibilityLabel="Aumentar uma hora"
            onPress={() => alterarHora(1)}
          />

          <View
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Horas"
            accessibilityValue={{ min: 0, max: 23, now: Number(hora), text: `${Number(hora)} horas` }}
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuenow={Number(hora)}
            aria-valuetext={`${Number(hora)} horas`}
            focusable
            onKeyDown={Platform.OS === 'web' ? keyboardAdjustment(alterarHora) : undefined}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                alterarHora(1);
              } else if (event.nativeEvent.actionName === 'decrement') {
                alterarHora(-1);
              }
            }}
            style={[
              styles.caixaDigitos,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            <ThemedText type="display">{hora}</ThemedText>
          </View>

          <BotaoIcone
            icone="remove"
            accessibilityLabel="Diminuir uma hora"
            onPress={() => alterarHora(-1)}
          />
        </View>

        {/* Separador de dois pontos */}
        <View style={styles.separadorContainer}>
          <ThemedText type="display" style={styles.separador}>
            :
          </ThemedText>
        </View>

        {/* Coluna de Minutos */}
        <View style={styles.coluna}>
          <BotaoIcone
            icone="add"
            accessibilityLabel={`Aumentar ${passoMinutos} minutos`}
            onPress={() => alterarMinuto(1)}
          />

          <View
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Minutos"
            accessibilityValue={{ min: 0, max: 59, now: Number(minuto), text: `${Number(minuto)} minutos` }}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuenow={Number(minuto)}
            aria-valuetext={`${Number(minuto)} minutos`}
            focusable
            onKeyDown={Platform.OS === 'web' ? keyboardAdjustment(alterarMinuto) : undefined}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === 'increment') {
                alterarMinuto(1);
              } else if (event.nativeEvent.actionName === 'decrement') {
                alterarMinuto(-1);
              }
            }}
            style={[
              styles.caixaDigitos,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            <ThemedText type="display">{minuto}</ThemedText>
          </View>

          <BotaoIcone
            icone="remove"
            accessibilityLabel={`Diminuir ${passoMinutos} minutos`}
            onPress={() => alterarMinuto(-1)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  linhaSeletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  coluna: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  caixaDigitos: {
    minWidth: ComponentSize.horarioDigitos,
    minHeight: ComponentSize.horarioDigitos,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: BorderWidth.regular,
  },
  separadorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.two,
  },
  separador: {
    paddingHorizontal: Spacing.one,
  },
});
