import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';

const voltar = () => router.back();

const EmBreveScreen = () => {
  const { titulo } = useLocalSearchParams<{ titulo?: string }>();
  const nome = titulo ?? 'Em breve';

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} />
      <MainContainer>
        <ThemedText type="title" accessibilityRole="header">
          {nome}
        </ThemedText>
        <ThemedText type="subheading">Em breve</ThemedText>
        <ThemedText>
          A função &quot;{nome}&quot; ainda está sendo construída. Volte para continuar usando o
          aplicativo.
        </ThemedText>
        <Botao rotulo="Voltar" accessibilityLabel="Voltar para a tela anterior" onPress={voltar} />
      </MainContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
});

export default EmBreveScreen;
