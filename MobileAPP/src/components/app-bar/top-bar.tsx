import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopBarProps = {
  onVoltar?: () => void;
  onAjuda?: () => void;
  onAudio?: () => void;
};

const BOTAO = ComponentSize.topBarButton;

/**
 * Barra superior sem título sobre o fundo da tela:
 * - Botão voltar à esquerda (alvo de toque TouchTarget = 56dp);
 * - Ações de ajuda e áudio à direita (alvos de toque TouchTarget = 56dp com círculo visual de 31px).
 *
 * Em conformidade com WCAG 2.2 AAA (Critério 2.5.5) sem sobreposição de hitSlop entre controles.
 */
export const TopBar = ({ onVoltar, onAjuda, onAudio }: TopBarProps) => {
  const theme = useTheme();
  const acoes = [
    onAjuda && { icone: 'help' as const, rotulo: 'Ajuda', onPress: onAjuda },
    onAudio && { icone: 'mic' as const, rotulo: 'Áudio', onPress: onAudio },
  ].filter((acao): acao is { icone: 'help' | 'mic'; rotulo: string; onPress: () => void } => !!acao);

  const botoes = acoes.map((acao) => (
    <Pressable
      key={acao.rotulo}
      onPress={acao.onPress}
      accessibilityRole="button"
      accessibilityLabel={acao.rotulo}
      style={({ pressed }) => [styles.areaToqueAcao, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.circulo, { borderColor: theme.border }]}>
        <SymbolView name={{ android: acao.icone }} size={22} tintColor={theme.text} />
      </View>
    </Pressable>
  ));

  return (
    <BarFrame posicao="top" fundo="background" style={styles.barra}>
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

      <View style={styles.espaco} />

      {botoes.length > 1 ? (
        <View style={[styles.grupo, { borderColor: theme.border }]}>{botoes}</View>
      ) : (
        botoes
      )}
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
  grupo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.full,
  },
  areaToqueAcao: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
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
