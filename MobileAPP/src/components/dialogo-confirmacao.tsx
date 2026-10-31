import { Modal, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DialogoConfirmacaoProps = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  rotuloConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export const DialogoConfirmacao = ({
  visivel,
  titulo,
  mensagem,
  rotuloConfirmar,
  onConfirmar,
  onCancelar,
}: DialogoConfirmacaoProps) => {
  const theme = useTheme();

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={[styles.fundo, { backgroundColor: theme.overlay }]}>
        <View
          style={[styles.caixa, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessibilityViewIsModal>
          <ThemedText type="subheading" accessibilityRole="header">
            {titulo}
          </ThemedText>
          <ThemedText>{mensagem}</ThemedText>
          <View style={styles.botoes}>
            <Botao
              rotulo="Cancelar"
              variante="secundario"
              accessibilityLabel="Cancelar e manter"
              onPress={onCancelar}
              style={styles.botao}
            />
            <Botao rotulo={rotuloConfirmar} onPress={onConfirmar} style={styles.botao} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  caixa: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  botoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  botao: {
    flex: 1,
  },
});
