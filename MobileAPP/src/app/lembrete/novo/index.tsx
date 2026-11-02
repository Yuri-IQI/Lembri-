import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { CardTemplate } from '@/components/forms/card-template';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useComandosDeVoz } from '@/hooks/use-comandos-de-voz';
import { templatesLembreteMock } from '@/mocks/templates-lembrete.mock';
import type { ComandoVoz } from '@/types/comando-voz';
import type { TemplateLembrete } from '@/types/template-lembrete';

const voltar = () => router.back();

const escolher = (template: TemplateLembrete) =>
  router.push({
    pathname: '/lembrete/novo/[template]',
    params: { template: template.id },
  });

const COMANDOS_VOZ: ComandoVoz[] = templatesLembreteMock.map((template) => ({
  id: `template-${template.id}`,
  rotulo: template.nome,
  frases: [template.nome],
  executar: () => escolher(template),
}));

const NovoLembreteScreen = () => {
  useComandosDeVoz(COMANDOS_VOZ);

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <ThemedText type="title" accessibilityRole="header">
          O que você quer lembrar?
        </ThemedText>
        {templatesLembreteMock.map((template) => (
          <CardTemplate
            key={template.id}
            template={template}
            onEscolher={() => escolher(template)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

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
