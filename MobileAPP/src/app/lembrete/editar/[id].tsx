import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import { FormularioLembrete } from '@/components/formulario/formulario-lembrete';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { CriarLembreteInput } from '@/types/lembrete';

const semAcao = () => {};
const voltar = () => router.back();

/**
 * Tela de Edição de Lembrete Existente (CARD-33 - Figma 152:1551).
 */
const EditarLembreteScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lembrete = useLembretesStore((state) => state.lembretes.find((item) => item.id === id));
  const editarLembrete = useLembretesStore((state) => state.editarLembrete);
  const [sucesso, setSucesso] = useState<string | null>(null);

  if (!lembrete) {
    return (
      <View style={styles.tela}>
        <TopBar onVoltar={voltar} />
        <View style={styles.conteudo}>
          <ThemedText type="title" accessibilityRole="header">
            Lembrete não encontrado
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            O lembrete que você está tentando editar não existe ou foi removido.
          </ThemedText>
        </View>
      </View>
    );
  }

  const handleSalvar = (input: CriarLembreteInput) => {
    editarLembrete(lembrete.id, input);
    setSucesso(`Lembrete "${input.titulo}" atualizado!`);
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} onAjuda={semAcao} onAudio={semAcao} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <ThemedText type="title" accessibilityRole="header">
          Editar Lembrete
        </ThemedText>

        {sucesso && (
          <AvisoSucesso mensagem={sucesso} onFechar={() => router.back()} />
        )}

        <FormularioLembrete
          dadosIniciais={{
            titulo: lembrete.titulo,
            tipoId: lembrete.tipoId,
            horarios: lembrete.horarios,
            dias: lembrete.dias,
            descricao: lembrete.descricao,
            exigeConfirmacao: lembrete.exigeConfirmacao,
            templateOrigem: lembrete.templateOrigem,
          }}
          onSalvar={handleSalvar}
          rotuloBotao="SALVAR ALTERAÇÕES"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four * 2,
  },
});

export default EditarLembreteScreen;
