import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { BarFrame } from '@/components/app-bar/bar-frame';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useVozStore } from '@/stores/useVozStore';

type TopBarProps = {
  titulo?: string;
  onVoltar?: () => void;
  semAjuda?: boolean;
  saidaProtegida?: boolean;
};

const abrirAjuda = () => router.push('/ajuda');

export const TopBar = ({ titulo, onVoltar, semAjuda = false, saidaProtegida = false }: TopBarProps) => {
  const theme = useTheme();
  const abrirVoz = useVozStore((state) => state.abrir);
  const acoes = [
    { icone: 'question_mark' as const, rotulo: 'Ajuda', onPress: abrirAjuda },
    { icone: 'mic' as const, rotulo: 'Áudio', onPress: () => abrirVoz({ voltar: onVoltar, saidaProtegida }) },
  ].slice(semAjuda ? 1 : 0);

  const botoes = acoes.map((acao) => (
    <Pressable
      key={acao.rotulo}
      onPress={acao.onPress}
      accessibilityRole="button"
      accessibilityLabel={acao.rotulo}
      style={({ pressed }) => [styles.areaToqueAcao, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.pilula, { borderColor: theme.border, backgroundColor: theme.chipBackground }]}>
        <MaterialSymbol name={acao.icone} size={24} tintColor={theme.text} />
        <ThemedText type="smallBold">{acao.rotulo}</ThemedText>
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
            <MaterialSymbol name={'arrow_back'} size={32} tintColor={theme.text} />
          </Pressable>
        )}
      </View>

      <View style={styles.espaco}>
        {titulo && <ThemedText type="subheading" accessibilityRole="header" numberOfLines={1}>{titulo}</ThemedText>}
      </View>

      {botoes}
    </BarFrame>
  );
};

const styles = StyleSheet.create({
  barra: {
    minHeight: ComponentSize.topBarHeight,
    paddingHorizontal: Spacing.two,
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
});
