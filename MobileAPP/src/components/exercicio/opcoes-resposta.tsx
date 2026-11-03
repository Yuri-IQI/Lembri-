import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface OpcoesRespostaProps {
  opcoes: string[];
  respostasAtuais: string[];
  activePosition?: number;
  twoColumns?: boolean;
  aoSelecionarOpcao: (opcao: string) => void;
}

export const OpcoesResposta = ({
  opcoes,
  respostasAtuais,
  activePosition,
  twoColumns = false,
  aoSelecionarOpcao,
}: OpcoesRespostaProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        {activePosition ? `OPÇÕES · CASA ${activePosition} DE ${respostasAtuais.length}` : 'OPÇÕES DISPONÍVEIS'}
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
                twoColumns && styles.twoColumns,
                {
                  backgroundColor: jaUsada ? theme.background : theme.surface,
                  borderColor: jaUsada ? theme.borderSubtle : theme.border,
                  opacity: jaUsada ? 0.45 : 1,
                },
              ]}>
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
    minWidth: TouchTarget,
    maxWidth: '100%',
    flexShrink: 1,
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
  twoColumns: {
    flexBasis: '45%',
    flexGrow: 1,
    paddingHorizontal: Spacing.two,
  },
});
