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
  cor?: ThemeColor;
  ordem?: number;
  numeric?: boolean;
  style?: StyleProp<ViewStyle>;
}

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
