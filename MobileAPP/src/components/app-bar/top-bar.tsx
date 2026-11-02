import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopBarProps = {
  /** Nome da tela; usado só nos formulários de lembrete. */
  titulo?: string;
  onVoltar?: () => void;
  onAjuda?: () => void;
  onAudio?: () => void;
};

const BOTAO = ComponentSize.topBarButton;

/**
 * Barra superior com fundo próprio (título só nos formulários):
 * - Botão voltar à esquerda (alvo de toque TouchTarget = 56dp);
 * - Ações de ajuda e áudio à direita, em pílulas com ícone e rótulo (alvo de toque TouchTarget = 56dp).
 *
 * Em conformidade com WCAG 2.2 AAA (Critério 2.5.5) sem sobreposição de hitSlop entre controles.
 */
export const TopBar = ({ titulo, onVoltar, onAjuda, onAudio }: TopBarProps) => {
  const theme = useTheme();
  const acoes = [
    onAjuda && { icone: 'question_mark' as const, rotulo: 'Ajuda', onPress: onAjuda },
    onAudio && { icone: 'mic' as const, rotulo: 'Áudio', onPress: onAudio },
  ].filter(
    (acao): acao is { icone: 'question_mark' | 'mic'; rotulo: string; onPress: () => void } =>
      !!acao,
  );

  const botoes = acoes.map((acao) => (
    <Pressable
      key={acao.rotulo}
      onPress={acao.onPress}
      accessibilityRole="button"
      accessibilityLabel={acao.rotulo}
      style={({ pressed }) => [styles.areaToqueAcao, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.pilula, { borderColor: theme.border }]}>
        <View style={[styles.circulo, { borderColor: theme.border }]}>
          <SymbolView name={{ android: acao.icone }} size={22} tintColor={theme.text} />
        </View>
        <ThemedText type="small">{acao.rotulo}</ThemedText>
      </View>
    </Pressable>
  ));

  return (
    <BarFrame posicao="top" style={styles.barra}>
      <View style={styles.voltarContainer}>
        {onVoltar && (
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [styles.areaToqueVoltar, { opacity: pressed ? 0.6 : 1 }]}>
            <SymbolView name={{ android: 'arrow_back' }} size={32} tintColor={theme.text} />
          </Pressable>
        )}
      </View>

      <View style={styles.espaco}>
        {titulo && (
          <ThemedText type="subheading" accessibilityRole="header" numberOfLines={1}>
            {titulo}
          </ThemedText>
        )}
      </View>

      {botoes}
    </BarFrame>
  );
};

const styles = StyleSheet.create({
  barra: {
    minHeight: ComponentSize.topBarHeight,
    paddingHorizontal: Spacing.four,
  },
  voltarContainer: {
    minWidth: TouchTarget,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  areaToqueVoltar: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  espaco: {
    flex: 1,
  },
  areaToqueAcao: {
    height: TouchTarget,
    justifyContent: 'center',
  },
  pilula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingLeft: Spacing.one,
    paddingRight: Spacing.two,
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.full,
  },
  circulo: {
    width: BOTAO,
    height: BOTAO,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.full,
  },
});
