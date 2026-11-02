import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { LinhaInterruptor } from '@/components/ajustes/linha-interruptor';
import { SecaoApagarDados } from '@/components/ajustes/secao-apagar-dados';
import { SecaoDesenvolvimento } from '@/components/ajustes/secao-desenvolvimento';
import { GrupoCard } from '@/components/grupo-card';
import { LinhaAcao } from '@/components/linha-acao';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

const abrirAjuda = () => router.push('/ajuda');

/**
 * Tela de ajustes do Lembri (CARD-27, Figma Android Compact - 7): acessibilidade, notificações,
 * dicas dos exercícios, acesso à ajuda e ao suporte e apagar todos os dados.
 */
const ConfiguracoesScreen = () => {
  const isLargeText = useSettingsStore((state) => state.isLargeText);
  const toggleLargeText = useSettingsStore((state) => state.toggleLargeText);
  const reminderAlerts = useSettingsStore((state) => state.reminderAlerts);
  const toggleReminderAlerts = useSettingsStore((state) => state.toggleReminderAlerts);
  const showExerciseHints = useSettingsStore((state) => state.showExerciseHints);
  const toggleExerciseHints = useSettingsStore((state) => state.toggleExerciseHints);

  return (
    <MainContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <ThemedText type="title" accessibilityRole="header">
          Ajustes
        </ThemedText>

        <GrupoCard titulo="ACESSIBILIDADE">
          <LinhaInterruptor
            titulo="Texto Amplificado"
            descricao="Aumente o tamanho do texto para melhorar sua visibilidade."
            ligado={isLargeText}
            onAlternar={toggleLargeText}
          />
        </GrupoCard>

        <GrupoCard titulo="NOTIFICAÇÕES">
          <LinhaInterruptor
            titulo="Avisos de Lembretes"
            descricao="Receba notificações no seu dispositivo para se manter atualizado sobre os prazos dos lembretes."
            ligado={reminderAlerts}
            onAlternar={toggleReminderAlerts}
          />
        </GrupoCard>

        <GrupoCard titulo="EXERCÍCIOS">
          <LinhaInterruptor
            titulo="Dicas nos Exercícios"
            descricao="Ao conferir a resposta, mostra se o número está acima ou abaixo do certo e marca em amarelo o que é de outra posição."
            ligado={showExerciseHints}
            onAlternar={toggleExerciseHints}
          />
        </GrupoCard>

        <GrupoCard titulo="SOBRE">
          <LinhaAcao
            titulo="Instruções de Uso"
            descricao="Página de ajuda do aplicativo."
            abreOutraTela
            onPress={abrirAjuda}
          />
          <LinhaAcao
            titulo="Suporte"
            descricao="Entrar em contato com a equipe de suporte."
            abreOutraTela
            onPress={abrirAjuda}
          />
        </GrupoCard>

        <SecaoApagarDados />

        {__DEV__ && <SecaoDesenvolvimento />}
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  conteudo: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
});

export default ConfiguracoesScreen;
