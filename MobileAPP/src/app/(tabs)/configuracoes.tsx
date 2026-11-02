import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DeviceSection } from '@/components/ajustes/device-section';
import { NotificationSettings } from '@/components/ajustes/notification-settings';
import { SecaoDesenvolvimento } from '@/components/ajustes/secao-desenvolvimento';
import { Botao } from '@/components/botao';
import { CartaoAjuste } from '@/components/cartao-ajuste';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Preferências persistidas, avisos reais, dispositivos simulados e entradas da ajuda.
 */
const ConfiguracoesScreen = () => {
  const isLargeText = useSettingsStore((state) => state.isLargeText);
  const toggleLargeText = useSettingsStore((state) => state.toggleLargeText);

  return (
    <MainContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" accessibilityRole="header">Ajustes</ThemedText>
        <View style={styles.section}>
          <ThemedText type="label" accessibilityRole="header">Acessibilidade</ThemedText>
          <CartaoAjuste
            titulo="Texto ampliado"
            descricao="Aumenta em 20% o tamanho de todos os textos do Lembri para melhorar o conforto visual e a legibilidade."
            ligado={isLargeText}
            onAlternar={toggleLargeText}
          />
        </View>
        <NotificationSettings />
        <DeviceSection />
        <View style={styles.section}>
          <ThemedText type="label" accessibilityRole="header">Sobre</ThemedText>
          <Botao rotulo="Instruções de uso" variante="secundario" onPress={() => router.navigate('/ajuda')} />
          <Botao rotulo="Suporte" variante="secundario"
            onPress={() => router.navigate({ pathname: '/ajuda', params: { section: 'contact' } })} />
        </View>
        {__DEV__ && <SecaoDesenvolvimento />}
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  content: { gap: Spacing.four, paddingBottom: Spacing.four },
  section: { gap: Spacing.two },
});

export default ConfiguracoesScreen;
