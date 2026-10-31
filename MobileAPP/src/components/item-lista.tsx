import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ItemListaProps = {
  icone: AndroidSymbol;
  titulo: string;
  subtitulo?: string;
  onPress: () => void;
  accessibilityHint?: string;
};

/**
 * Item de lista padronizado com ícone simbólico, títulos informativos e seta indicativa (CARD-24).
 *
 * Garante alvo de toque mínimo de 56dp (WCAG 2.2 AAA — Critério 2.5.5) abrangendo toda a linha
 * e leitura autônoma unificada por leitores de tela.
 */
export const ItemLista = ({
  icone,
  titulo,
  subtitulo,
  onPress,
  accessibilityHint,
}: ItemListaProps) => {
  const theme = useTheme();
  const label = subtitulo ? `${titulo}, ${subtitulo}` : titulo;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.borderSubtle,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <View style={styles.iconeContainer}>
        <SymbolView name={{ android: icone }} size={28} tintColor={theme.primary} />
      </View>
      <View style={styles.textos}>
        <ThemedText type="defaultBold">{titulo}</ThemedText>
        {subtitulo ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitulo}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.setaContainer}>
        <SymbolView name={{ android: 'chevron_right' }} size={24} tintColor={theme.textSecondary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
  },
  iconeContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    justifyContent: 'center',
  },
  setaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
