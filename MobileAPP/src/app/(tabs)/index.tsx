import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, FontFamily, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWear } from '@/hooks/use-wear';
import { useLembretesStore } from '@/stores/useLembretesStore';

/**
 * Tela inicial do aplicativo Lembri.
 * Exibe o status da conexão com o Wear OS e os próximos lembretes pendentes da store Zustand.
 */
const HomeScreen = () => {
  const theme = useTheme();
  const { disponivel, relogios, enviar, atualizarRelogios } = useWear();
  const [titulo, setTitulo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);

  const { lembretes, adicionarLembrete, toggleConcluido } = useLembretesStore(
    useShallow((state) => ({
      lembretes: state.lembretes,
      adicionarLembrete: state.adicionarLembrete,
      toggleConcluido: state.toggleConcluido,
    }))
  );

  const lembretesPendentes = useMemo(() => {
    return lembretes.filter((item) => !item.concluido);
  }, [lembretes]);

  const handleEnviar = async () => {
    const texto = titulo.trim();
    if (!texto) return;

    // Registra na store reativa do aplicativo
    adicionarLembrete(texto);

    if (disponivel) {
      const entregues = await enviar(texto);
      setAviso(
        entregues > 0
          ? `Lembrete criado e enviado para ${entregues} relógio(s).`
          : 'Lembrete cadastrado, mas nenhum relógio conectado.'
      );
    } else {
      setAviso('Lembrete cadastrado com sucesso no aplicativo.');
    }

    setTitulo('');
  };

  return (
    <MainContainer>
      {/* Card do Relógio Inteligente */}
      <Card>
        <ThemedText type="label">Relógio</ThemedText>
        {!disponivel ? (
          <ThemedText>
            Comunicação com relógio disponível apenas em um development build Android (não
            funciona no Expo Go).
          </ThemedText>
        ) : (
          <>
            <ThemedText type="defaultBold">
              {relogios.length > 0
                ? `Conectado: ${relogios.map((r) => r.nome).join(', ')}`
                : 'Nenhum relógio com o Lembri encontrado'}
            </ThemedText>
            <Pressable
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Procurar relógios Wear OS novamente"
              onPress={atualizarRelogios}
              style={styles.botaoRecarregar}>
              <ThemedText type="link">Procurar novamente</ThemedText>
            </Pressable>
          </>
        )}
      </Card>

      {/* Formulário de Adição Rápida */}
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Tomar remédio"
        placeholderTextColor={theme.textMuted}
        accessibilityLabel="Título do novo lembrete"
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        onSubmitEditing={handleEnviar}
      />
      <Pressable
        onPress={handleEnviar}
        disabled={!titulo.trim()}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Adicionar lembrete e sincronizar com o relógio"
        style={({ pressed }) => [
          styles.botao,
          { backgroundColor: theme.primary },
          { opacity: !titulo.trim() ? 0.4 : pressed ? 0.7 : 1 },
        ]}>
        <ThemedText type="button" themeColor="onPrimary">
          Adicionar lembrete
        </ThemedText>
      </Pressable>
      {aviso && <ThemedText type="small">{aviso}</ThemedText>}

      {/* Próximos Lembretes Não Concluídos */}
      <ThemedText type="label">Próximos Lembretes</ThemedText>
      <FlatList
        style={styles.lista}
        data={lembretesPendentes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.two, paddingBottom: Spacing.four }}
        ListEmptyComponent={
          <Card style={styles.cardVazio}>
            <ThemedText type="subheading">Nenhum lembrete pendente</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Você está em dia com todas as suas atividades!
            </ThemedText>
          </Card>
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.cardHeader}>
              <ThemedText type="subheading">{item.titulo}</ThemedText>
              <ThemedText type="smallBold" themeColor="textSecondary">
                {item.horario}
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Pendente
            </ThemedText>
            <Pressable
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Marcar ${item.titulo} como concluído`}
              onPress={() => toggleConcluido(item.id)}
              style={({ pressed }) => [
                styles.botaoConcluir,
                { backgroundColor: theme.surface, borderColor: theme.border },
                pressed && styles.botaoPressionado,
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                Concluir
              </ThemedText>
            </Pressable>
          </Card>
        )}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: TouchTarget,
    fontFamily: FontFamily,
    fontSize: 19,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  botao: {
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  botaoRecarregar: {
    minHeight: TouchTarget,
    justifyContent: 'center',
  },
  lista: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botaoConcluir: {
    minHeight: TouchTarget,
    marginTop: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  cardVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.one,
  },
});

export default HomeScreen;
