import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DiaSemana } from '@/types/lembrete';

export type SeletorDiasProps = {
  selecionados: DiaSemana[];
  onAlterar: (dias: DiaSemana[]) => void;
  rotulo?: string;
};

const CONFIG_DIAS: { dia: DiaSemana; letra: string; nomeCompleto: string }[] = [
  { dia: 0, letra: 'D', nomeCompleto: 'Domingo' },
  { dia: 1, letra: 'S', nomeCompleto: 'Segunda-feira' },
  { dia: 2, letra: 'T', nomeCompleto: 'Terça-feira' },
  { dia: 3, letra: 'Q', nomeCompleto: 'Quarta-feira' },
  { dia: 4, letra: 'Q', nomeCompleto: 'Quinta-feira' },
  { dia: 5, letra: 'S', nomeCompleto: 'Sexta-feira' },
  { dia: 6, letra: 'S', nomeCompleto: 'Sábado' },
];

/**
 * Seletor de dias da semana em linha para repetição de lembretes (CARD-26).
 *
 * Características de acessibilidade WCAG 2.2 AAA:
 * - Alvos de toque com altura mínima TouchTarget = 56dp e largura mínima de 44dp;
 * - Suporta quebra automática (flexWrap) caso a largura da tela seja insuficiente;
 * - Leitores de tela anunciam o nome completo do dia (ex: "Segunda-feira") e seu estado checked.
 */
export const SeletorDias = ({
  selecionados,
  onAlterar,
  rotulo = 'Dias da semana',
}: SeletorDiasProps) => {
  const theme = useTheme();

  const handleToggle = (dia: DiaSemana) => {
    if (selecionados.includes(dia)) {
      onAlterar(selecionados.filter((d) => d !== dia));
    } else {
      const novos = [...selecionados, dia].sort((a, b) => a - b);
      onAlterar(novos);
    }
  };

  return (
    <View style={styles.container}>
      {rotulo ? <ThemedText type="label">{rotulo}</ThemedText> : null}

      <View style={styles.gradeDias}>
        {CONFIG_DIAS.map((item) => {
          const ativo = selecionados.includes(item.dia);

          return (
            <Pressable
              key={item.dia}
              onPress={() => handleToggle(item.dia)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: ativo }}
              accessibilityLabel={item.nomeCompleto}
              style={({ pressed }) => [
                styles.botaoDia,
                {
                  backgroundColor: ativo ? theme.primary : theme.surface,
                  borderColor: ativo ? theme.primary : theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <ThemedText
                type="subheading"
                style={{ color: ativo ? theme.onPrimary : theme.text }}>
                {item.letra}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  gradeDias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  botaoDia: {
    flex: 1,
    minWidth: 44,
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: BorderWidth.regular,
  },
});
