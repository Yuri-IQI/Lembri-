import type { AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LinhaAcaoProps = {
  titulo: string;
  descricao: string;
  icone?: AndroidSymbol;
  abreOutraTela?: boolean;
  onPress: () => void;
};

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
      {icone && <MaterialSymbol name={icone} size={32} tintColor={theme.text} />}
      <View style={styles.textos}>
        <ThemedText type="subheading" style={abreOutraTela && styles.sublinhado}>
          {titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {descricao}
        </ThemedText>
      </View>
      {abreOutraTela && (
        <MaterialSymbol name={'open_in_new'} size={32} tintColor={theme.text} />
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
