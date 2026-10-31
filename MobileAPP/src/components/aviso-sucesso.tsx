import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const AVISO_DURACAO_MS = 6000;

export type AvisoSucessoProps = {
  mensagem: string | null;
  onFechar: () => void;
};

/**
 * Componente de aviso de sucesso / toast acessível (WCAG 2.2 AAA — Critérios 2.2.3 e 4.1.3).
 *
 * Exibe confirmação imediata da operação com ícone check_circle e botão explícito "Fechar".
 * - Anuncia automaticamente a mensagem para tecnologias assistivas (TalkBack/VoiceOver).
 * - Fecha sozinho após 6s apenas se o leitor de tela estiver inativo.
 * - Mantém-se visível por tempo indeterminado quando o leitor de tela estiver ativo.
 */
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
