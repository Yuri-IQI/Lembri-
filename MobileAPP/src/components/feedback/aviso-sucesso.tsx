import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const AVISO_DURACAO_MS = 6000;

export type AvisoSucessoProps = {
  mensagem: string | null;
  onFechar: () => void;
};

export const AvisoSucesso = ({ mensagem, onFechar }: AvisoSucessoProps) => {
  const theme = useTheme();

  useEffect(() => {
    if (!mensagem) return;

    AccessibilityInfo.announceForAccessibility(mensagem);

    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelado = false;

    AccessibilityInfo.isScreenReaderEnabled().then((leitorAtivo) => {
      if (!cancelado && !leitorAtivo) {
        timer = setTimeout(() => {
          onFechar();
        }, AVISO_DURACAO_MS);
      }
    });

    return () => {
      cancelado = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [mensagem, onFechar]);

  if (!mensagem) {
    return null;
  }

  return (
    <Card style={[styles.card, { borderColor: theme.border }]}>
      <View style={styles.conteudo}>
        <SymbolView name={{ android: 'check_circle' }} size={28} tintColor={theme.primary} />
        <ThemedText
          type="defaultBold"
          accessibilityLiveRegion="polite"
          style={styles.texto}>
          {mensagem}
        </ThemedText>
      </View>
      <Botao
        rotulo="Fechar"
        variante="secundario"
        tamanho="compacto"
        accessibilityLabel={`Fechar aviso: ${mensagem}`}
        onPress={onFechar}
        style={styles.botaoFechar}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.regular,
  },
  conteudo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  texto: {
    flex: 1,
  },
  botaoFechar: {
    alignSelf: 'center',
  },
});
