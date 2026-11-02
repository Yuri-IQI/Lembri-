import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { PerguntaFrequente } from '@/components/ajuda/pergunta-frequente';
import { TopBar } from '@/components/app-bar/top-bar';
import { GrupoCard } from '@/components/grupo-card';
import { LinhaAcao } from '@/components/linha-acao';
import { ThemedText } from '@/components/themed-text';
import { CONTATO_SUPORTE, PERGUNTAS_FREQUENTES, PERGUNTAS_RELOGIO } from '@/constants/ajuda';
import { Spacing } from '@/constants/theme';

const voltar = () => router.back();

/** Abre o discador ou o app de email; se o aparelho não tiver um, o contato segue visível na linha. */
const abrir = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

/**
 * Tela de ajuda (Figma Android Compact - 9): dúvidas sobre o app e o relógio e contato com o suporte.
 */
const AjudaScreen = () => (
  <View style={styles.tela}>
    <TopBar onVoltar={voltar} semAjuda />
    <ScrollView contentContainerStyle={styles.conteudo}>
      <ThemedText type="title" accessibilityRole="header">
        Ajuda
      </ThemedText>

      <GrupoCard titulo="DÚVIDAS FREQUENTES">
        {PERGUNTAS_FREQUENTES.map((item, index) => (
          <PerguntaFrequente
            key={item.pergunta}
            pergunta={item.pergunta}
            resposta={item.resposta}
            abertaAoIniciar={index === 0}
          />
        ))}
      </GrupoCard>

      <GrupoCard titulo="USAR O RELÓGIO">
        {PERGUNTAS_RELOGIO.map((item) => (
          <PerguntaFrequente key={item.pergunta} pergunta={item.pergunta} resposta={item.resposta} />
        ))}
      </GrupoCard>

      <GrupoCard titulo="FALAR COM ALGUÉM">
        <LinhaAcao
          icone="call"
          titulo="Ligar para o suporte"
          descricao={CONTATO_SUPORTE.telefone}
          onPress={() => abrir(`tel:${CONTATO_SUPORTE.telefone.replace(/\s/g, '')}`)}
        />
        <LinhaAcao
          icone="mail"
          titulo="Enviar Email"
          descricao={CONTATO_SUPORTE.email}
          onPress={() => abrir(`mailto:${CONTATO_SUPORTE.email}`)}
        />
      </GrupoCard>
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
    paddingBottom: Spacing.five,
  },
});

export default AjudaScreen;
