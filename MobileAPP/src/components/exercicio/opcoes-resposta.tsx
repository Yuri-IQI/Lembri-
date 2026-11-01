import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface OpcoesRespostaProps {
  opcoes: string[];
  respostasAtuais: string[];
  aoSelecionarOpcao: (opcao: string) => void;
}

/**
 * Catálogo de opções em formato de chips embaralhados para os exercícios de ordenação,
 * associações e lista de compras (RN-EX-09 e Figma exercicios_exec).
 *
 * Desabilita visualmente e na acessibilidade chips que já foram alocados em alguma casa.
 */
export const OpcoesResposta = ({
  opcoes,
  respostasAtuais,
  aoSelecionarOpcao,
}: OpcoesRespostaProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        OPÇÕES DISPONÍVEIS
      </ThemedText>

      <View style={styles.grade}>
        {opcoes.map((opcao, index) => {
          const jaUsada = respostasAtuais.includes(opcao);

          return (
            <Pressable
              key={`opcao-${opcao}-${index}`}
              onPress={() => !jaUsada && aoSelecionarOpcao(opcao)}
              disabled={jaUsada}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Opção ${opcao}${jaUsada ? ', já utilizada' : ''}`}
              accessibilityState={{ disabled: jaUsada }}
              style={[
                styles.chip,
                {
                  backgroundColor: jaUsada ? theme.background : theme.surface,
                  borderColor: jaUsada ? theme.borderSubtle : theme.border,
                  opacity: jaUsada ? 0.45 : 1,
                },
              ]}
              hitSlop={8}>
              <ThemedText
                type="defaultBold"
                style={[
                  styles.texto,
                  { color: jaUsada ? theme.textSecondary : theme.text },
                ]}>
                {opcao}
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
    gap: Spacing.two,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  chip: {
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.regular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    textAlign: 'center',
  },
});
