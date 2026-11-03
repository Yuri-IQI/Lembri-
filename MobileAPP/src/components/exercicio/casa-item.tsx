import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type EstadoCasaItem = 'neutra' | 'vazia' | 'correta' | 'errada';

export interface CasaItemProps {
  valor: string;
  estado: EstadoCasaItem;
  dica?: string;
  /** Cor do contexto da rodada: preenche a casa neutra e contorna a casa avaliada. */
  cor?: ThemeColor;
  /** Posição do item na atividade, exibida antes do valor. */
  ordem?: number;
  /** Número de leitura: usa preenchimento compacto e status abaixo dos dígitos. */
  numeric?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Célula individual de item de exercício com 4 estados visuais e acessíveis (WCAG 1.4.1 e 1.4.6).
 *
 * Estados:
 * - `neutra`: exibição durante memorização (fundo cinza neutro);
 * - `vazia`: casa aguardando preenchimento na resposta (borda tracejada e ponto de interrogação);
 * - `correta`: resposta avaliada como certa (fundo verde claro e indicador visual ✓);
 * - `errada`: resposta avaliada como incorreta (fundo vermelho claro e indicador visual ✗).
 */
export const CasaItem = ({ valor, estado, dica, cor, ordem, numeric = false, style }: CasaItemProps) => {
  const theme = useTheme();

  let estiloFundo: string = theme.chipSelected;
  let estiloBorda: string = theme.borderSubtle;
  let bordaTracejada = false;
  let sufixoAcessivel = '';
  let iconeStatus: string | null = null;

  switch (estado) {
    case 'neutra':
      estiloFundo = theme.chipSelected;
      estiloBorda = theme.border;
      break;
    case 'vazia':
      estiloFundo = theme.inputBackground;
      estiloBorda = theme.borderDashed;
      bordaTracejada = true;
      sufixoAcessivel = 'vazia';
      break;
    case 'correta':
      estiloFundo = theme.answerCorrect;
      estiloBorda = theme.border;
      sufixoAcessivel = 'correto';
      iconeStatus = '✓';
      break;
    case 'errada':
      estiloFundo = theme.answerWrong;
      estiloBorda = theme.border;
      sufixoAcessivel = 'errado';
      iconeStatus = '✗';
      break;
  }

  if (cor) {
    if (estado === 'neutra') {
      estiloFundo = theme[cor];
    } else {
      estiloBorda = theme[cor];
    }
  }

  const textoItem = estado === 'vazia' ? '?' : valor;
  const textoExibido = ordem ? `${ordem}º ${textoItem}` : textoItem;
  const labelAcessivel = dica
    ? `${dica}: ${textoExibido}${sufixoAcessivel ? `, ${sufixoAcessivel}` : ''}`
    : `${textoExibido}${sufixoAcessivel ? `, ${sufixoAcessivel}` : ''}`;

  return (
    <View
      style={[
        styles.container,
        numeric && styles.numeric,
        {
          backgroundColor: estiloFundo,
          borderColor: estiloBorda,
          borderStyle: bordaTracejada ? 'dashed' : 'solid',
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={labelAcessivel}>
      {dica && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.dica}>
          {dica}
        </ThemedText>
      )}

      <View style={styles.conteudo}>
        <ThemedText type="defaultBold" style={styles.texto}>
          {textoExibido}
        </ThemedText>

        {iconeStatus && (
          <ThemedText type="smallBold" style={styles.icone}>
            {iconeStatus}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 52,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.regular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dica: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  numeric: {
    minWidth: ComponentSize.exerciseNumberMinWidth,
    paddingHorizontal: Spacing.one,
  },
  conteudo: {
    flexDirection: 'column',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  texto: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    textAlign: 'center',
  },
  icone: {
    fontSize: 16,
  },
});
