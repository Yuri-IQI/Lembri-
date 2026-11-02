import { StyleSheet, View } from 'react-native';

import { ChipRemovivel } from '@/components/formulario/selecao/chip-removivel';
import { Spacing } from '@/constants/theme';

type ListaChipsProps = {
  itens: string[];
  onRemover: (item: string) => void;
};

export const ListaChips = ({ itens, onRemover }: ListaChipsProps) =>
  itens.length > 0 ? (
    <View style={styles.grade}>
      {itens.map((item) => (
        <ChipRemovivel key={item} texto={item} onRemover={() => onRemover(item)} />
      ))}
    </View>
  ) : null;

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
