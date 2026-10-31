import { StyleSheet, View } from 'react-native';

import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type CampoConfirmacaoProps = {
  ligado: boolean;
  onAlterar: (ligado: boolean) => void;
};

/**
 * Interruptor "Exige confirmação" com explicação curta.
 */
export const CampoConfirmacao = ({ ligado, onAlterar }: CampoConfirmacaoProps) => (
  <View style={styles.linha}>
    <View style={styles.textos}>
      <ThemedText type="defaultBold">Exige confirmação</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Pedir que você marque &quot;Fiz&quot; quando terminar.
      </ThemedText>
    </View>
    <Interruptor
      ligado={ligado}
      onAlternar={() => onAlterar(!ligado)}
      accessibilityLabel="Exige confirmação"
    />
  </View>
);

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  textos: {
    flex: 1,
    gap: Spacing.one,
  },
});
