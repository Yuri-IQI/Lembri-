import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  BorderWidth,
  Radius,
  Spacing,
  TouchTarget,
  getScaledTypography,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

export type CampoTextoProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  rotulo: string;
  valor: string;
  onAlterar: (texto: string) => void;
  ajuda?: string;
  erro?: string;
  inputStyle?: StyleProp<TextStyle>;
};

/**
 * Campo de texto acessível padronizado para formulários do Lembri (CARD-26).
 *
 * Características de acessibilidade WCAG 2.2 AAA:
 * - Rótulo textual sempre visível acima da caixa de entrada;
 * - Altura mínima TouchTarget = 56dp (Critério 2.5.5);
 * - Destaque visual e tátil no estado de foco com borda reforçada;
 * - Mensagens contextuais de ajuda (Critério 3.3.5) e de erro em Colors.danger com ícone simbólico;
 * - Respeita o modo "Texto ampliado" via getScaledTypography.
 */
export const CampoTexto = ({
  rotulo,
  valor,
  onAlterar,
  ajuda,
  erro,
  inputStyle,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...rest
}: CampoTextoProps) => {
  const theme = useTheme();
  const isLargeText = useSettingsStore((state) => state.isLargeText);
  const [focado, setFocado] = useState(false);

  const estiloTipografia = getScaledTypography('default', isLargeText);

  const corBorda = erro ? theme.danger : focado ? theme.primary : theme.border;
  const larguraBorda = erro || focado ? BorderWidth.thick : BorderWidth.regular;

  return (
    <View style={styles.container}>
      <ThemedText type="label">{rotulo}</ThemedText>

      <TextInput
        value={valor}
        onChangeText={onAlterar}
        onFocus={(e) => {
          setFocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          onBlur?.(e);
        }}
        placeholderTextColor={placeholderTextColor ?? theme.textMuted}
        accessibilityLabel={rotulo}
        accessibilityHint={erro ? `Erro: ${erro}. ${ajuda ?? ''}` : ajuda}
        aria-invalid={!!erro}
        style={[
          styles.input,
          estiloTipografia,
          {
            backgroundColor: theme.surface,
            borderColor: corBorda,
            borderWidth: larguraBorda,
            color: theme.text,
          },
          inputStyle,
        ]}
        {...rest}
      />

      {erro ? (
        <View style={styles.linhaFeedback}>
          <SymbolView name={{ android: 'error' }} size={18} tintColor={theme.danger} />
          <ThemedText type="smallBold" style={[styles.textoErro, { color: theme.danger }]}>
            {erro}
          </ThemedText>
        </View>
      ) : ajuda ? (
        <ThemedText type="small" themeColor="textSecondary">
          {ajuda}
        </ThemedText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
  },
  linhaFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  textoErro: {
    flex: 1,
  },
});
