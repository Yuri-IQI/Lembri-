import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TopBarProps = {
  titulo: string;
  onVoltar?: () => void;
  onAjuda?: () => void;
  onAudio?: () => void;
};

const BOTAO = 31;
// Amplia a área de toque dos botões de 31px para ~48px.
const AREA_EXTRA = 8;

export const TopBar = ({ titulo, onVoltar, onAjuda, onAudio }: TopBarProps) => {
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
    <BarFrame posicao="top" style={styles.barra}>
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

      <ThemedText
        type="title"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={styles.titulo}>
        {titulo}
      </ThemedText>

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
    paddingLeft: Spacing.three,
    paddingRight: 12,
  },
  voltar: {
    width: 40,
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 900,
  },
  grupo: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 17.5,
  },
  botao: {
    width: BOTAO,
    height: BOTAO,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BOTAO / 2,
  },
});
