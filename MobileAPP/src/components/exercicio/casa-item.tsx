import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type EstadoCasaItem = 'neutra' | 'vazia' | 'correta' | 'errada';

export interface CasaItemProps {
  valor: string;
  estado: EstadoCasaItem;
  dica?: string;
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
export const CasaItem = ({ valor, estado, dica }: CasaItemProps) => {
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

  const textoExibido = estado === 'vazia' ? '?' : valor;
  const labelAcessivel = dica
    ? `${dica}: ${textoExibido}${sufixoAcessivel ? `, ${sufixoAcessivel}` : ''}`
    : `${textoExibido}${sufixoAcessivel ? `, ${sufixoAcessivel}` : ''}`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: estiloFundo,
          borderColor: estiloBorda,
          borderStyle: bordaTracejada ? 'dashed' : 'solid',
        },
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
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  texto: {
    textAlign: 'center',
  },
  icone: {
    fontSize: 16,
  },
});
