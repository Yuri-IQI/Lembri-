import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ItemSugestaoProps = {
  texto: string;
  icone: AndroidSymbol;
  rotuloAcessivel: string;
  onEscolher: () => void;
  onEsquecer?: () => void;
};

/**
 * Linha da lista de sugestões com 56dp de altura e, quando houver, o botão "Esquecer".
 */
export const ItemSugestao = ({
  texto,
  icone,
  rotuloAcessivel,
  onEscolher,
  onEsquecer,
}: ItemSugestaoProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.linha, { borderColor: theme.borderSubtle }]}>
      <Pressable
        onPress={onEscolher}
        accessibilityRole="button"
        accessibilityLabel={rotuloAcessivel}
        style={({ pressed }) => [styles.escolher, { opacity: pressed ? 0.6 : 1 }]}>
        <SymbolView name={{ android: icone }} size={22} tintColor={theme.textSecondary} />
        <ThemedText style={styles.texto} numberOfLines={2}>
          {texto}
        </ThemedText>
      </Pressable>
      {onEsquecer && (
        <Pressable
          onPress={onEsquecer}
          accessibilityRole="button"
          accessibilityLabel={`Esquecer ${texto}`}
          style={({ pressed }) => [styles.esquecer, { opacity: pressed ? 0.6 : 1 }]}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sublinhado}>
            Esquecer
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: BorderWidth.hairline,
  },
  escolher: {
    flex: 1,
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  texto: {
    flex: 1,
  },
  esquecer: {
    minWidth: TouchTarget,
    minHeight: TouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  sublinhado: {
    textDecorationLine: 'underline',
  },
});
