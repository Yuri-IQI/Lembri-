import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { MensagemErro } from '@/components/formulario/mensagem-erro';
import { RotuloCampo } from '@/components/formulario/rotulo-campo';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget, getScaledTypography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

export type CampoTextoProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  rotulo: string;
  valor: string;
  onAlterar: (texto: string) => void;
  ajuda?: string;
  erro?: string;
  obrigatorio?: boolean;
  /** Esconde o rótulo visível quando o campo já está dentro de um bloco rotulado. */
  rotuloOculto?: boolean;
  /** Botão com ícone no fim da caixa (ex.: relógio que abre o seletor de horário). */
  acao?: { icone: AndroidSymbol; rotulo: string; onPress: () => void };
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
  obrigatorio = false,
  rotuloOculto = false,
  acao,
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
      {!rotuloOculto && <RotuloCampo rotulo={rotulo} obrigatorio={obrigatorio} />}

      <View>
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
          accessibilityLabel={obrigatorio ? `${rotulo}, obrigatório` : rotulo}
          accessibilityHint={erro ? `Erro: ${erro}. ${ajuda ?? ''}` : ajuda}
          aria-invalid={!!erro}
          style={[
            styles.input,
            estiloTipografia,
            acao && styles.inputComAcao,
            {
              backgroundColor: theme.inputBackground,
              borderColor: corBorda,
              borderWidth: larguraBorda,
              color: theme.text,
            },
          ]}
          {...rest}
        />
        {acao && (
          <Pressable
            onPress={acao.onPress}
            accessibilityRole="button"
            accessibilityLabel={acao.rotulo}
            style={({ pressed }) => [styles.acao, { opacity: pressed ? 0.6 : 1 }]}>
            <SymbolView name={{ android: acao.icone }} size={28} tintColor={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {erro ? (
        <MensagemErro mensagem={erro} />
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
  inputComAcao: {
    paddingRight: TouchTarget,
  },
  acao: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
