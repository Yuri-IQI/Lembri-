import { StyleSheet, View } from 'react-native';

import { EtiquetaTipo } from '@/components/etiqueta-tipo';
import { Spacing } from '@/constants/theme';
import type { TipoLembrete } from '@/types/tipo-lembrete';

/**
 * Etiquetas dos tipos do lembrete, lado a lado.
 */
export const ListaEtiquetas = ({ tipos }: { tipos: TipoLembrete[] }) =>
  tipos.length > 0 ? (
    <View style={styles.grade}>
      {tipos.map((tipo) => (
        <EtiquetaTipo key={tipo.id} tipo={tipo} />
      ))}
    </View>
  ) : null;

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
});
