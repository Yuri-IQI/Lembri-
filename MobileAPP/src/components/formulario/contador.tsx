import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';

export type ContadorProps = {
  rotulo: string;
  /** Valor já formatado para exibição (ex.: "1,5"). */
  valor: string;
  /** Valor lido pelo leitor de tela (ex.: "1,5 comprimido"). */
  valorAcessivel?: string;
  onDiminuir: () => void;
  onAumentar: () => void;
  podeDiminuir: boolean;
  podeAumentar: boolean;
};

/**
 * Botões − e + com o valor entre eles, com alvos de 56dp.
 */
export const Contador = ({
  rotulo,
  valor,
  valorAcessivel = valor,
  onDiminuir,
  onAumentar,
  podeDiminuir,
  podeAumentar,
}: ContadorProps) => (
  <View style={styles.container}>
    <ThemedText type="defaultBold">{rotulo}</ThemedText>
    <View style={styles.linha}>
      <BotaoIcone
        icone="remove"
        accessibilityLabel={`Diminuir ${rotulo.toLowerCase()}`}
        accessibilityState={{ disabled: !podeDiminuir }}
        disabled={!podeDiminuir}
        onPress={onDiminuir}
      />
      <ThemedText
        type="subheading"
        style={styles.valor}
        accessibilityLiveRegion="polite"
        accessibilityLabel={`${rotulo}: ${valorAcessivel}`}>
        {valor}
      </ThemedText>
      <BotaoIcone
        icone="add"
        accessibilityLabel={`Aumentar ${rotulo.toLowerCase()}`}
        accessibilityState={{ disabled: !podeAumentar }}
        disabled={!podeAumentar}
        onPress={onAumentar}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  valor: {
    minWidth: TouchTarget,
    textAlign: 'center',
  },
});
