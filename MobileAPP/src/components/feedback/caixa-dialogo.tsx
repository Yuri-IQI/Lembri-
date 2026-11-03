import { useEffect, useRef, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao, type BotaoVariante } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { focusAccessibleElement } from '@/utils/accessibility-focus';

export type CaixaDialogoProps = {
  visivel: boolean;
  titulo: string;
  children: ReactNode;
  rotuloConfirmar: string;
  rotuloCancelar?: string;
  descricaoCancelar?: string;
  varianteConfirmar?: Extract<BotaoVariante, 'primario' | 'perigo'>;
  somenteConfirmar?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  returnFocusRef?: RefObject<ComponentRef<typeof View> | null>;
};

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
  returnFocusRef,
}: CaixaDialogoProps) => {
  const theme = useTheme();
  const titleRef = useRef<ComponentRef<typeof Text>>(null);
  const wasVisible = useRef(false);
  useEffect(() => {
    if (wasVisible.current && !visivel) {
      const frame = requestAnimationFrame(() => void focusAccessibleElement(returnFocusRef?.current ?? null));
      wasVisible.current = visivel;
      return () => cancelAnimationFrame(frame);
    }
    wasVisible.current = visivel;
  }, [visivel, returnFocusRef]);

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}
      onShow={() => void focusAccessibleElement(titleRef.current)}>
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
            <ThemedText ref={titleRef} accessible type="subheading" accessibilityRole="header">
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
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  botao: {
    flexGrow: 1,
    flexBasis: TouchTarget * 3,
  },
});
