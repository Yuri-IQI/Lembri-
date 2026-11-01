import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface CasasRespostaProps {
  respostas: string[];
  casaAtiva: number;
  dicas?: string[];
  aoSelecionarCasa: (indice: number) => void;
}

/**
 * Fileira interativa de casas de resposta (Figma exercicios_exec).
 *
 * Exibe as casas na ordem da rodada, destacando a casa ativa selecionada e permitindo
 * toque direto em qualquer posição para revisão ou correção manual (decisão D8).
 */
export const CasasResposta = ({
  respostas,
  casaAtiva,
  dicas,
  aoSelecionarCasa,
}: CasasRespostaProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        RESPOSTA
      </ThemedText>

      <View style={styles.fileira}>
        {respostas.map((valor, index) => {
          const estaAtiva = index === casaAtiva;
          const estaPreenchida = valor.length > 0;
          const dica = dicas ? dicas[index] : undefined;

          const texto = estaPreenchida ? valor : '?';
          const estadoTexto = estaPreenchida
            ? `preenchida com ${valor}`
            : 'vazia';
          const selecaoTexto = estaAtiva ? ', selecionada' : '';
          const dicaTexto = dica ? `para ${dica}` : '';
          const rotuloAcessivel = `Casa ${index + 1} de ${respostas.length} ${dicaTexto}, ${estadoTexto}${selecaoTexto}`;

          let bordaCor: string = theme.borderDashed;
          let fundoCor: string = theme.inputBackground;

          if (estaAtiva) {
            bordaCor = theme.primary;
            fundoCor = theme.surface;
          } else if (estaPreenchida) {
            bordaCor = theme.border;
            fundoCor = theme.chipSelected;
          }

          return (
            <Pressable
              key={`casa-${index}`}
              onPress={() => aoSelecionarCasa(index)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={rotuloAcessivel}
              style={[
                styles.casa,
                {
                  borderColor: bordaCor,
                  backgroundColor: fundoCor,
                  borderWidth: estaAtiva ? BorderWidth.regular : BorderWidth.hairline,
                  borderStyle: estaPreenchida || estaAtiva ? 'solid' : 'dashed',
                },
              ]}
              hitSlop={8}>
              {dica && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.dica}>
                  {dica}
                </ThemedText>
              )}
              <ThemedText
                type="defaultBold"
                style={[styles.texto, { color: estaPreenchida ? theme.text : theme.textSecondary }]}>
                {texto}
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
  fileira: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  casa: {
    minWidth: 54,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dica: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  texto: {
    textAlign: 'center',
  },
});
