import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { CampoTexto } from '@/components/formulario/texto/campo-texto';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ItemChecklistProps = {
  posicao: number;
  texto: string;
  maximoCaracteres: number;
  onAlterar: (texto: string) => void;
  onRemover: () => void;
};

export const ItemChecklist = ({
  posicao,
  texto,
  maximoCaracteres,
  onAlterar,
  onRemover,
}: ItemChecklistProps) => {
  const theme = useTheme();

  return (
    <View style={styles.linha}>
      <View style={styles.campo}>
        <CampoTexto
          rotulo={`Passo ${posicao}`}
          valor={texto}
          onAlterar={onAlterar}
          maxLength={maximoCaracteres}
          placeholder="Ex.: Separar as roupas"
        />
      </View>
      <Pressable
        onPress={onRemover}
        accessibilityRole="button"
        accessibilityLabel={`Remover passo ${posicao}`}
        style={({ pressed }) => [styles.remover, { opacity: pressed ? 0.6 : 1 }]}>
        <MaterialSymbol name="delete" size={26} tintColor={theme.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  campo: {
    flex: 1,
  },
  remover: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
