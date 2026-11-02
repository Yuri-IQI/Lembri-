import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface BarraAcoesExercicioProps {
  onContinuar: () => void;
  continuarHabilitado?: boolean;
  mensagemAviso?: string;
  rotuloContinuar?: string;
}

export const BarraAcoesExercicio = ({
  onContinuar,
  continuarHabilitado = true,
  mensagemAviso,
  rotuloContinuar = 'CONTINUAR',
}: BarraAcoesExercicioProps) => {
  return (
    <View style={styles.container}>
      {!continuarHabilitado && mensagemAviso && (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.mensagemAviso}
          accessible={true}
          accessibilityRole="text">
          {mensagemAviso}
        </ThemedText>
      )}

      <View style={styles.linhaBotoes}>
        <Botao
          rotulo={rotuloContinuar}
          variante="primario"
          desabilitado={!continuarHabilitado}
          onPress={onContinuar}
          accessibilityLabel="Continuar para a próxima etapa"
          style={styles.botao}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  mensagemAviso: {
    textAlign: 'center',
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  botao: {
    flex: 1,
  },
});
