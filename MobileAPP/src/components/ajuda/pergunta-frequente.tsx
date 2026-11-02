import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PerguntaFrequenteProps = {
  pergunta: string;
  resposta: string;
  abertaAoIniciar?: boolean;
};

export const PerguntaFrequente = ({
  pergunta,
  resposta,
  abertaAoIniciar = false,
}: PerguntaFrequenteProps) => {
  const theme = useTheme();
  const [aberta, setAberta] = useState(abertaAoIniciar);

  return (
    <Pressable
      onPress={() => setAberta((prev) => !prev)}
      accessibilityRole="button"
      accessibilityState={{ expanded: aberta }}
      accessibilityLabel={aberta ? `${pergunta} ${resposta}` : pergunta}
      style={({ pressed }) => [styles.linha, { opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.textos}>
        <ThemedText type="subheading">{pergunta}</ThemedText>
        {aberta && (
          <ThemedText type="small" themeColor="textSecondary">
            {resposta}
          </ThemedText>
        )}
      </View>
      <SymbolView
        name={{ android: aberta ? 'do_not_disturb_on' : 'add_circle' }}
        size={32}
        tintColor={theme.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linha: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  textos: {
    flex: 1,
    gap: Spacing.one,
  },
});
