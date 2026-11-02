import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AvaliacaoCasa } from '@/utils/exercicio/exercicio';

export interface CasasRespostaProps {
  respostas: string[];
  casaAtiva: number;
  dicas?: string[];
  rascunho?: string;
  avaliacoes?: (AvaliacaoCasa | null)[];
  colunas?: number;
  cor?: ThemeColor;
  numerada?: boolean;
  aoSelecionarCasa: (indice: number) => void;
}

const descreverAvaliacao = ({ estado, direcao, posicaoCerta }: AvaliacaoCasa, numerada: boolean) => {
  if (estado === 'correta') return { marca: '✓', fala: 'correto' };
  const lugar = estado === 'lugar' ? 'em outra posição' : '';
  if (estado === 'lugar' && numerada) {
    return { marca: `é o ${posicaoCerta}º passo`, fala: `é o passo ${posicaoCerta}` };
  }
  if (direcao === 'acima') return { marca: '↑ acima', fala: `acima do valor certo ${lugar}` };
  if (direcao === 'abaixo') return { marca: '↓ abaixo', fala: `abaixo do valor certo ${lugar}` };
  return estado === 'lugar'
    ? { marca: 'outro lugar', fala: lugar }
    : { marca: '✗', fala: 'errado' };
};

export const CasasResposta = ({
  respostas,
  casaAtiva,
  dicas,
  rascunho = '',
  avaliacoes,
  colunas,
  cor,
  numerada = false,
  aoSelecionarCasa,
}: CasasRespostaProps) => {
  const theme = useTheme();
  const ampliadas = colunas !== undefined;

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
        RESPOSTA
      </ThemedText>

      <View style={styles.fileira}>
        {respostas.map((valor, index) => {
          const estaAtiva = index === casaAtiva;
          const digitando = estaAtiva && rascunho.length > 0;
          const estaPreenchida = valor.length > 0 || digitando;
          const dica = dicas ? dicas[index] : undefined;
          const avaliacao = digitando ? null : avaliacoes?.[index] ?? null;
          const descricao = avaliacao ? descreverAvaliacao(avaliacao, numerada) : null;

          const texto = digitando ? rascunho : valor || (ampliadas ? '' : '?');
          const estadoTexto = estaPreenchida
            ? `preenchida com ${digitando ? rascunho : valor}`
            : 'vazia';
          const selecaoTexto = estaAtiva ? ', selecionada' : '';
          const dicaTexto = dica ? `para ${dica}` : '';
          const avaliacaoTexto = descricao ? `, ${descricao.fala}` : '';
          const rotuloAcessivel = `Casa ${index + 1} de ${respostas.length} ${dicaTexto}, ${estadoTexto}${avaliacaoTexto}${selecaoTexto}`;

          let bordaCor: string = theme.borderDashed;
          let fundoCor: string = theme.inputBackground;

          if (estaAtiva) {
            bordaCor = theme.primary;
            fundoCor = theme.surface;
          } else if (estaPreenchida) {
            bordaCor = theme.border;
            fundoCor = theme.chipSelected;
          }

          if (avaliacao) {
            fundoCor = {
              correta: theme.answerCorrect,
              lugar: theme.accent,
              errada: theme.answerWrong,
            }[avaliacao.estado];
            if (cor) {
              bordaCor = theme[cor];
            }
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
                ampliadas && [styles.casaAmpliada, { width: `${90 / colunas}%` }],
                numerada && styles.casaNumerada,
                {
                  borderColor: bordaCor,
                  backgroundColor: fundoCor,
                  borderWidth: estaAtiva || (avaliacao && cor) ? BorderWidth.regular : BorderWidth.hairline,
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
                type={ampliadas ? 'subheading' : 'defaultBold'}
                style={[styles.texto, { color: estaPreenchida ? theme.text : theme.textSecondary }]}>
                {numerada && texto ? `${index + 1}º ${texto}` : texto}
              </ThemedText>
              {descricao && (
                <ThemedText type="small" style={styles.marca}>
                  {descricao.marca}
                </ThemedText>
              )}
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
  casaAmpliada: {
    minHeight: 96,
    paddingHorizontal: 2,
  },
  casaNumerada: {
    minHeight: TouchTarget,
  },
  dica: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  texto: {
    textAlign: 'center',
  },
  marca: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
