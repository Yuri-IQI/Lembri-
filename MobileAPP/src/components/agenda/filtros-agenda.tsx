import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import type { ChaveSecao } from '@/hooks/use-agenda';
import { useTheme } from '@/hooks/use-theme';

type FiltrosAgendaProps = {
  ativa: ChaveSecao;
  pausados: number;
  onSelecionar: (chave: ChaveSecao) => void;
};

export const FiltrosAgenda = ({ ativa, pausados, onSelecionar }: FiltrosAgendaProps) => {
  const theme = useTheme();
  const filtros: { chave: ChaveSecao; rotulo: string }[] = [
    { chave: 'proximas', rotulo: 'A seguir' },
    { chave: 'passadas', rotulo: 'Já passaram' },
    { chave: 'pausados', rotulo: `Pausados (${pausados})` },
  ];

  return (
    <View style={styles.filtros} accessibilityRole="tablist">
      {filtros.map((filtro) => {
        const selecionado = filtro.chave === ativa;
        return (
          <Pressable
            key={filtro.chave}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionado }}
            accessibilityLabel={`Mostrar ${filtro.rotulo}`}
            onPress={() => onSelecionar(filtro.chave)}
            style={({ pressed }) => [
              styles.filtro,
              {
                backgroundColor: selecionado ? theme.primary : theme.surface,
                borderColor: selecionado ? theme.primary : theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <ThemedText
              type="smallBold"
              themeColor={selecionado ? 'onPrimary' : 'text'}
              style={styles.texto}>
              {filtro.rotulo}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  filtros: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filtro: {
    flex: 1,
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  texto: {
    textAlign: 'center',
  },
});
