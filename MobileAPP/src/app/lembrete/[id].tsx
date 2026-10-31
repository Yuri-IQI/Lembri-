import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { AcoesLembrete } from '@/components/lembrete/acoes-lembrete';
import { BlocoConfiguracao } from '@/components/lembrete/bloco-configuracao';
import { BlocoProximaVez } from '@/components/lembrete/bloco-proxima-vez';
import { BlocoUltimasVezes } from '@/components/lembrete/bloco-ultimas-vezes';
import { CabecalhoLembrete } from '@/components/lembrete/cabecalho-lembrete';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAgora } from '@/hooks/use-agora';
import { proximaOcorrenciaDoLembrete } from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';

const semAcao = () => { };
const voltar = () => router.back();

const DetalheLembreteScreen = () => {
  const agora = useAgora();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lembrete = useLembretesStore((state) => state.lembretes.find((item) => item.id === id));
  const registros = useLembretesStore((state) => state.registros);
  const marcarFeito = useLembretesStore((state) => state.marcarFeito);
  const desmarcarFeito = useLembretesStore((state) => state.desmarcarFeito);

  const proxima = useMemo(
    () => (lembrete ? proximaOcorrenciaDoLembrete(lembrete, agora) : null),
    [lembrete, agora]
  );

  const isProximaFeita = useMemo(
    () => (proxima ? registros.some((r) => r.chave === proxima.chave) : false),
    [proxima, registros]
  );

  const handleAlternarFeito = () => {
    if (!proxima) return;
    if (isProximaFeita) {
      desmarcarFeito(proxima.chave);
    } else {
      marcarFeito(proxima);
    }
  };

  if (!lembrete) {
    return (
      <View style={styles.tela}>
        <TopBar onVoltar={voltar} />
        <View style={styles.conteudo}>
          <ThemedText type="title" accessibilityRole="header">
            Lembrete não encontrado
          </ThemedText>
          <ThemedText>Ele pode ter sido removido. Volte para a lista de lembretes.</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} onAjuda={semAcao} onAudio={semAcao} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoLembrete lembrete={lembrete} />
        <BlocoProximaVez
          lembrete={lembrete}
          proxima={proxima}
          agora={agora}
          feito={isProximaFeita}
          onAlternarFeito={handleAlternarFeito}
        />
        <BlocoConfiguracao lembrete={lembrete} horarioDestacado={proxima?.horario} />
        <BlocoUltimasVezes lembreteId={lembrete.id} agora={agora} />
      </ScrollView>
      <AcoesLembrete lembrete={lembrete} />
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.three - Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
});

export default DetalheLembreteScreen;
