import { Modal, StyleSheet, View } from 'react-native';

import { Botao, type BotaoVariante } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type DialogoConfirmacaoProps = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  rotuloConfirmar: string;
  varianteConfirmar?: Extract<BotaoVariante, 'primario' | 'perigo'>;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/**
 * Diálogo modal acessível de confirmação de ações críticas (WCAG 2.2 AAA — Prevenção de Erros 3.3.6).
 *
 * Apresenta o título, mensagem explicativa da consequência e dois botões de tamanho TouchTarget = 56dp:
 * - Cancelar (sempre secundário para manter o estado sem alteração)
 * - Confirmar (primário ou perigo para ações destrutivas como exclusão).
 */
export const DialogoConfirmacao = ({
  visivel,
  titulo,
  mensagem,
  rotuloConfirmar,
  varianteConfirmar = 'primario',
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
            <Botao
              rotulo={rotuloConfirmar}
              variante={varianteConfirmar}
              onPress={onConfirmar}
              style={styles.botao}
            />
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
