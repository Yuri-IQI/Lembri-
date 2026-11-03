import type { AndroidSymbol } from 'expo-symbols';
import type { ComponentRef, Ref } from 'react';
import { Pressable, StyleSheet, type StyleProp, type View, type ViewStyle } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BotaoVariante = 'primario' | 'secundario' | 'perigo';

export type BotaoProps = {
  rotulo: string;
  onPress: () => void;
  variante?: BotaoVariante;
  tamanho?: 'normal' | 'compacto';
  icone?: AndroidSymbol;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  desabilitado?: boolean;
  /** Operação em andamento, anunciada pelo leitor de tela. */
  ocupado?: boolean;
  controlRef?: Ref<ComponentRef<typeof View>>;
};

/**
 * Botão principal acessível do Lembri (WCAG 2.2 AAA com alvo mínimo TouchTarget = 56dp).
 *
 * Suporta três variantes semânticas:
 * - `primario`: fundo escuro sólido para ações principais (ex: Salvar, Começar).
 * - `secundario`: fundo em superfície com contorno escuro para ações de apoio (ex: Detalhes, Cancelar).
 * - `perigo`: fundo vermelho de alto contraste (Colors.danger) para ações destrutivas (ex: Excluir).
 */
export const Botao = ({
  rotulo,
  onPress,
  variante = 'primario',
  tamanho = 'normal',
  icone,
  accessibilityLabel,
  style,
  desabilitado = false,
  ocupado = false,
  controlRef,
}: BotaoProps) => {
  const theme = useTheme();

  const mapaCores: Record<
    BotaoVariante,
    { fundo: string; borda: string; corTexto: ThemeColor }
  > = {
    primario: {
      fundo: theme.primary,
      borda: theme.primary,
      corTexto: 'onPrimary',
    },
    secundario: {
      fundo: theme.surface,
      borda: theme.primary,
      corTexto: 'text',
    },
    perigo: {
      fundo: theme.danger,
      borda: theme.danger,
      corTexto: 'onPrimary',
    },
  };

  const { fundo, borda, corTexto } = mapaCores[variante];

  return (
    <Pressable
      ref={controlRef}
      onPress={desabilitado ? undefined : onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? rotulo}
      accessibilityState={{ disabled: desabilitado, busy: ocupado }}
      aria-disabled={desabilitado}
      aria-busy={ocupado}
      style={({ pressed }) => [
        styles.botao,
        {
          backgroundColor: desabilitado ? theme.borderSubtle : fundo,
          borderColor: desabilitado ? theme.borderSubtle : borda,
          opacity: desabilitado ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}>
      {icone && <MaterialSymbol name={icone} size={28} tintColor={theme[corTexto]} />}
      <ThemedText type={tamanho === 'normal' ? 'button' : 'smallBold'} themeColor={corTexto} style={styles.label}>
        {rotulo}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
  botao: {
    minHeight: TouchTarget,
    minWidth: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thick,
  },
});
