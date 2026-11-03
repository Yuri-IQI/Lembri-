import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type OpcaoChip<T extends string> = {
  valor: T;
  rotulo: string;
};

export type ChipsSelecaoProps<T extends string> = {
  rotulo: string;
  opcoes: OpcaoChip<T>[];
  selecionados: T[];
  onAlterar: (valores: T[]) => void;
  multipla?: boolean;
};

export function ChipsSelecao<T extends string>({
  rotulo,
  opcoes,
  selecionados,
  onAlterar,
  multipla = false,
}: ChipsSelecaoProps<T>) {
  const theme = useTheme();

  const handlePress = (valor: T) => {
    const ativo = selecionados.includes(valor);

    if (multipla) {
      if (ativo) {
        onAlterar(selecionados.filter((v) => v !== valor));
      } else {
        onAlterar([...selecionados, valor]);
      }
    } else {
      onAlterar([valor]);
    }
  };

  return (
    <View style={styles.container}>
      {rotulo ? <ThemedText type="label">{rotulo}</ThemedText> : null}

      <View style={styles.gradeChips}>
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao.valor);

          return (
            <Pressable
              key={opcao.valor}
              onPress={() => handlePress(opcao.valor)}
              accessibilityRole={multipla ? 'checkbox' : 'radio'}
              accessibilityState={{ checked: ativo }}
              aria-checked={ativo}
              accessibilityLabel={opcao.rotulo}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: ativo ? theme.chipSelected : theme.surface,
                  borderColor: ativo ? theme.primary : theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              {ativo && (
                <MaterialSymbol name="check" size={20} tintColor={theme.primary} />
              )}
              <ThemedText type={ativo ? 'defaultBold' : 'default'}>{opcao.rotulo}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  gradeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.regular,
  },
});
