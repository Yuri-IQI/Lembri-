import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ItemTipoProps = {
  nome: string;
  corHex: string;
  detalhe: string;
  /** Sem `onAlternar`, a linha não tem caixa de seleção. */
  selecionado?: boolean;
  /** Ausente quando já há o máximo escolhido e este tipo não está entre eles. */
  onAlternar?: () => void;
  /** Ausente no tipo padrão que ainda não existe. */
  onExcluir?: () => void;
};

/**
 * Linha de "Meus tipos": caixa de seleção, cor, nome, quantos lembretes usam e a lixeira.
 */
export const ItemTipo = ({
  nome,
  corHex,
  detalhe,
  selecionado = false,
  onAlternar,
  onExcluir,
}: ItemTipoProps) => {
  const theme = useTheme();
  const selecionavel = onAlternar !== undefined || selecionado;

  return (
    <View style={styles.linha}>
      <Pressable
        onPress={onAlternar}
        disabled={!onAlternar}
        accessibilityRole={selecionavel ? 'checkbox' : undefined}
        accessibilityState={
          selecionavel ? { checked: selecionado, disabled: !onAlternar } : undefined
        }
        accessibilityLabel={`${nome}, ${detalhe}`}
        accessibilityHint={
          selecionavel && !onAlternar ? 'Já tem o máximo de tipos. Desmarque um antes.' : undefined
        }
        style={({ pressed }) => [styles.info, { opacity: pressed ? 0.7 : 1 }]}>
        {selecionavel && (
          <SymbolView
            name={{ android: selecionado ? 'check_box' : 'check_box_outline_blank' }}
            size={28}
            tintColor={onAlternar ? theme.text : theme.textSecondary}
          />
        )}
        <View style={[styles.bolinha, { backgroundColor: corHex, borderColor: theme.border }]} />
        <View style={styles.textos}>
          <ThemedText type="defaultBold">{nome}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {detalhe}
          </ThemedText>
        </View>
      </Pressable>
      {onExcluir && (
        <Pressable
          onPress={onExcluir}
          accessibilityRole="button"
          accessibilityLabel={`Excluir o tipo ${nome}`}
          accessibilityHint="Pede confirmação. Os lembretes não são apagados."
          style={({ pressed }) => [styles.lixeira, { opacity: pressed ? 0.6 : 1 }]}>
          <SymbolView name={{ android: 'delete_outline' }} size={24} tintColor={theme.danger} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TouchTarget,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.one,
  },
  bolinha: {
    width: ComponentSize.bolinhaTipo,
    height: ComponentSize.bolinhaTipo,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.hairline,
  },
  textos: {
    flex: 1,
  },
  lixeira: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
