import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface BarraAcoesExercicioProps {
  onSair: () => void;
  onContinuar: () => void;
  continuarHabilitado?: boolean;
  mensagemAviso?: string;
  rotuloContinuar?: string;
  rotuloSair?: string;
}

/**
 * Rodapé fixo de ações durante as fases do exercício cognitivo (Figma exercicios_exec e exercicios_res_err).
 *
 * Apresenta o botão secundário SAIR e o botão primário CONTINUAR.
 * Quando o avanço estiver bloqueado, exibe mensagem contextual explicativa (RN-EX-10).
 */
export const BarraAcoesExercicio = ({
  onSair,
  onContinuar,
  continuarHabilitado = true,
  mensagemAviso,
  rotuloContinuar = 'CONTINUAR',
  rotuloSair = 'SAIR',
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
          rotulo={rotuloSair}
          variante="secundario"
          onPress={onSair}
          accessibilityLabel="Sair do exercício"
          style={styles.botao}
        />
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
