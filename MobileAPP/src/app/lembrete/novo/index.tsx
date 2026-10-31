import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { CardTemplate } from '@/components/forms/card-template';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { templatesLembreteMock } from '@/mocks/templates-lembrete.mock';

const voltar = () => router.back();

const NovoLembreteScreen = () => (
  <View style={styles.tela}>
    <TopBar titulo="Novo lembrete" onVoltar={voltar} />
    <ScrollView contentContainerStyle={styles.conteudo}>
      <ThemedText type="title" accessibilityRole="header">
        O que você quer lembrar?
      </ThemedText>
      {templatesLembreteMock.map((template) => (
        <CardTemplate
          key={template.id}
          template={template}
          onEscolher={() =>
            router.push({
              pathname: '/lembrete/novo/[template]',
              params: { template: template.id },
            })
          }
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
});

export default NovoLembreteScreen;
