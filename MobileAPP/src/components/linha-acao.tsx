import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LinhaAcaoProps = {
  titulo: string;
  descricao: string;
  /** Ícone à esquerda dos textos. */
  icone?: AndroidSymbol;
  /** Sublinha o título e mostra o ícone de abrir à direita. */
  abreOutraTela?: boolean;
  onPress: () => void;
};

/**
 * Linha tocável de um GrupoCard, com alvo de toque de pelo menos TouchTarget = 56dp.
 */
export const LinhaAcao = ({
  titulo,
  descricao,
  icone,
  abreOutraTela = false,
  onPress,
}: LinhaAcaoProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${descricao}`}
      style={({ pressed }) => [styles.linha, { opacity: pressed ? 0.7 : 1 }]}>
      {icone && <SymbolView name={{ android: icone }} size={32} tintColor={theme.text} />}
      <View style={styles.textos}>
        <ThemedText type="subheading" style={abreOutraTela && styles.sublinhado}>
          {titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {descricao}
        </ThemedText>
      </View>
      {abreOutraTela && (
        <SymbolView name={{ android: 'open_in_new' }} size={32} tintColor={theme.text} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linha: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  textos: {
    flex: 1,
  },
  sublinhado: {
    textDecorationLine: 'underline',
  },
});
