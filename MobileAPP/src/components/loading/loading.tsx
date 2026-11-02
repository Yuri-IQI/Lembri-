import { StatusBar, StyleSheet, View } from 'react-native';

import { Eclipse } from '@/components/loading/eclipse';
import { ThemedText } from '@/components/themed-text';
import { Colors, LoadingEclipse, Spacing } from '@/constants/theme';

export type LoadingProps = {
  /** Chamado quando a tela já foi desenhada; só então o splash nativo pode sair sem tela preta. */
  onDesenhada: () => void;
};

/** Tela de carregamento exibida ao abrir o app, enquanto os dados salvos são lidos. */
export const Loading = ({ onDesenhada }: LoadingProps) => (
  <View style={styles.tela} accessibilityViewIsModal onLayout={onDesenhada}>
    <StatusBar barStyle="dark-content" />
    <Eclipse />
    <View style={styles.textos}>
      <ThemedText style={styles.marca}>LEMBRI!</ThemedText>
      <ThemedText
        themeColor="loadingTexto"
        style={styles.centro}
        accessibilityLiveRegion="polite">
        Carregando seus lembretes…
      </ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  tela: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: LoadingEclipse.espacoConteudo,
    paddingHorizontal: Spacing.four,
    backgroundColor: Colors.loadingFundo,
  },
  textos: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  marca: {
    fontFamily: LoadingEclipse.fonteMarca,
    fontWeight: '500',
    fontSize: LoadingEclipse.tamanhoMarca,
    lineHeight: LoadingEclipse.alturaMarca,
    letterSpacing: LoadingEclipse.espacoMarca,
    color: Colors.loadingSombra,
  },
  centro: {
    textAlign: 'center',
  },
});
