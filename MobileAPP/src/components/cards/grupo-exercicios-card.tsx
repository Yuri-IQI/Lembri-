import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { IconeExercicio } from '@/components/exercicio/icone-exercicio';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercicio } from '@/types/exercicio';
import { plural } from '@/utils/texto';

export interface GrupoExerciciosCardProps {
  titulo: string;
  icone: Exercicio['icone'];
  totalModos: number;
  children: ReactNode;
}

/**
 * Card colapsável que reúne os modos de jogo de um mesmo grupo de exercícios.
 */
export const GrupoExerciciosCard = ({
  titulo,
  icone,
  totalModos,
  children,
}: GrupoExerciciosCardProps) => {
  const theme = useTheme();
  const [expandido, setExpandido] = useState(false);

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => setExpandido((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: expandido }}
        accessibilityLabel={`${titulo}, ${plural(totalModos, 'modo de jogo', 'modos de jogo')}`}
        style={({ pressed }) => [styles.cabecalho, { opacity: pressed ? 0.7 : 1 }]}>
        <View style={[styles.areaIcone, { backgroundColor: theme.accentLight }]}>
          <IconeExercicio icone={icone} />
        </View>

        <View style={styles.info}>
          <ThemedText type="subheading" style={styles.titulo}>
            {titulo}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {plural(totalModos, 'modo de jogo', 'modos de jogo')}
          </ThemedText>
        </View>

        <MaterialSymbol
          name={expandido ? 'expand_less' : 'expand_more'}
          size={28}
          tintColor={theme.textSecondary}
        />
      </Pressable>

      {expandido ? <View style={styles.modos}>{children}</View> : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  cabecalho: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  areaIcone: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 30,
  },
  modos: {
    gap: Spacing.two,
  },
});
