import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CartaoAjusteProps = {
  titulo: string;
  descricao: string;
  ligado: boolean;
  onAlternar: () => void;
};

/**
 * Card colapsável para controle de preferências e ajustes do sistema (CARD-27).
 *
 * Apresenta o título e o interruptor (Switch) sempre visíveis na linha principal.
 * - Tocar no título ou na seta expande/recolhe a descrição detalhada;
 * - Tocar no interruptor alterna o ajuste de forma isolada, sem alterar a expansão;
 * - Totalmente acessível conforme WCAG 2.2 AAA com alvo mínimo de 56dp e estados semânticos.
 */
export const CartaoAjuste = ({
  titulo,
  descricao,
  ligado,
  onAlternar,
}: CartaoAjusteProps) => {
  const theme = useTheme();
  const [expandido, setExpandido] = useState(false);

  const rotuloBotaoExpansao = expandido
    ? `Ocultar explicação de ${titulo}`
    : `Mostrar explicação de ${titulo}`;

  return (
    <Card style={styles.card}>
      <View style={styles.linhaPrincipal}>
        <Pressable
          onPress={() => setExpandido((prev) => !prev)}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandido }}
          accessibilityLabel={rotuloBotaoExpansao}
          style={({ pressed }) => [styles.gatilhoExpansao, { opacity: pressed ? 0.7 : 1 }]}>
          <ThemedText type="subheading" style={styles.titulo}>
            {titulo}
          </ThemedText>
          <SymbolView
            name={{ android: expandido ? 'expand_less' : 'expand_more' }}
            size={24}
            tintColor={theme.textSecondary}
          />
        </Pressable>

        <Interruptor
          ligado={ligado}
          onAlternar={onAlternar}
          accessibilityLabel={`Alternar ajuste: ${titulo}`}
        />
      </View>

      {expandido ? (
        <View style={styles.descricaoContainer}>
          <ThemedText type="default" themeColor="textSecondary">
            {descricao}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  linhaPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  gatilhoExpansao: {
    flex: 1,
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  titulo: {
    flexShrink: 1,
  },
  descricaoContainer: {
    paddingTop: Spacing.one,
  },
});
