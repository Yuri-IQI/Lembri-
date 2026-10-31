import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, View } from 'react-native';

import { Botao, type BotaoVariante } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CaixaDialogoProps = {
  visivel: boolean;
  titulo: string;
  children: ReactNode;
  rotuloConfirmar: string;
  rotuloCancelar?: string;
  descricaoCancelar?: string;
  varianteConfirmar?: Extract<BotaoVariante, 'primario' | 'perigo'>;
  /** Esconde o botão de cancelar (avisos com uma única ação). */
  somenteConfirmar?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/**
 * Diálogo modal com título, conteúdo livre e dois botões grandes (cancelar e confirmar).
 */
export const CaixaDialogo = ({
  visivel,
  titulo,
  children,
  rotuloConfirmar,
  rotuloCancelar = 'Cancelar',
  descricaoCancelar = 'Cancelar e manter',
  varianteConfirmar = 'primario',
  somenteConfirmar = false,
  onConfirmar,
  onCancelar,
}: CaixaDialogoProps) => {
  const theme = useTheme();

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.fundo, { backgroundColor: theme.overlay }]}>
        <View
          style={[styles.caixa, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessibilityViewIsModal>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.conteudo}
            style={styles.rolagem}>
            <ThemedText type="subheading" accessibilityRole="header">
              {titulo}
            </ThemedText>
            {children}
          </ScrollView>
          <View style={styles.botoes}>
            {!somenteConfirmar && (
              <Botao
                rotulo={rotuloCancelar}
                variante="secundario"
                accessibilityLabel={descricaoCancelar}
                onPress={onCancelar}
                style={styles.botao}
              />
            )}
            <Botao
              rotulo={rotuloConfirmar}
              variante={varianteConfirmar}
              onPress={onConfirmar}
              style={styles.botao}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.three,
  },
  caixa: {
    maxHeight: '100%',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  rolagem: {
    flexGrow: 0,
  },
  conteudo: {
    gap: Spacing.three,
  },
  botoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  botao: {
    flex: 1,
  },
});
