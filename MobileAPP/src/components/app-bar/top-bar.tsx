import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { BorderWidth, ComponentSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopBarProps = {
  onVoltar?: () => void;
  onAjuda?: () => void;
  onAudio?: () => void;
};

const BOTAO = ComponentSize.topBarButton;
// Amplia a área de toque dos botões de 31px para ~48px.
const AREA_EXTRA = ComponentSize.topBarHitSlop;

/** Barra superior sem título, sobre o fundo da tela: voltar à esquerda, ajuda e áudio à direita. */
export const TopBar = ({ onVoltar, onAjuda, onAudio }: TopBarProps) => {
  const theme = useTheme();
  const acoes = [
    onAjuda && { icone: 'help' as const, rotulo: 'Ajuda', onPress: onAjuda },
    onAudio && { icone: 'mic' as const, rotulo: 'Áudio', onPress: onAudio },
  ].filter((acao) => !!acao);

  const botoes = acoes.map((acao) => (
    <Pressable
      key={acao.rotulo}
      onPress={acao.onPress}
      accessibilityRole="button"
      accessibilityLabel={acao.rotulo}
      hitSlop={AREA_EXTRA}
      style={[styles.botao, { borderColor: theme.border }]}>
      <SymbolView name={{ android: acao.icone }} size={22} tintColor={theme.text} />
    </Pressable>
  ));

  return (
    <BarFrame posicao="top" fundo="background" style={styles.barra}>
      <View style={styles.voltar}>
        {onVoltar && (
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={AREA_EXTRA}>
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
  voltar: {
    width: ComponentSize.topBarBackWidth,
  },
  espaco: {
    flex: 1,
  },
  grupo: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderWidth: BorderWidth.hairline,
    borderRadius: 17.5,
  },
  botao: {
    width: BOTAO,
    height: BOTAO,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BorderWidth.hairline,
    borderRadius: BOTAO / 2,
  },
});
