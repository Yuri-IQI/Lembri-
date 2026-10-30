import { StyleSheet, View } from 'react-native';

import { EtiquetaTipo } from '@/components/etiqueta-tipo';
import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { Lembrete } from '@/types/lembrete';

export const CabecalhoLembrete = ({ lembrete }: { lembrete: Lembrete }) => {
  const alternarAtivo = useLembretesStore((state) => state.alternarAtivo);
  const tipo = useTiposLembreteStore((state) =>
    state.tipos.find((item) => item.id === lembrete.tipoId)
  );

  return (
    <View style={styles.cabecalho}>
      <View style={styles.titulo}>
        <ThemedText type="title" accessibilityRole="header">
          {lembrete.titulo}
        </ThemedText>
        {tipo && <EtiquetaTipo tipo={tipo} />}
      </View>
      <View style={styles.alertar}>
        <Interruptor
          ligado={lembrete.ativo}
          onAlternar={() => alternarAtivo(lembrete.id)}
          accessibilityLabel={`Alertar ${lembrete.titulo}`}
        />
        <ThemedText type="small" themeColor="textSecondary" importantForAccessibility="no">
          Alertar
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  titulo: {
    flex: 1,
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  alertar: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.one,
  },
});
