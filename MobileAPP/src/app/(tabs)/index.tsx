import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, FontFamily, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWear } from '@/hooks/use-wear';

const HomeScreen = () => {
  const theme = useTheme();
  const { disponivel, relogios, lembretes, enviar, atualizarRelogios } = useWear();
  const [titulo, setTitulo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);

  const handleEnviar = async () => {
    const texto = titulo.trim();
    if (!texto) return;
    const entregues = await enviar(texto);
    setAviso(entregues > 0 ? `Enviado para ${entregues} relógio(s).` : 'Nenhum relógio recebeu.');
    if (entregues > 0) setTitulo('');
  };

  return (
    <MainContainer>
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
            <Pressable onPress={atualizarRelogios}>
              <ThemedText type="link">Procurar novamente</ThemedText>
            </Pressable>
          </>
        )}
      </Card>

      {/* Formulário de envio */}
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Tomar remédio"
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        onSubmitEditing={handleEnviar}
      />
      <Pressable
        onPress={handleEnviar}
        disabled={!disponivel || !titulo.trim()}
        style={({ pressed }) => [
          styles.botao,
          { backgroundColor: theme.primary },
          { opacity: !disponivel || !titulo.trim() ? 0.4 : pressed ? 0.7 : 1 },
        ]}>
        <ThemedText type="button" themeColor="onPrimary">
          Enviar ao relógio
        </ThemedText>
      </Pressable>
      {aviso && <ThemedText type="small">{aviso}</ThemedText>}

      {/* Lembretes enviados (atualizados pelas confirmações do relógio) */}
      <ThemedText type="label">Lembretes enviados</ThemedText>
      <FlatList
        style={styles.lista}
        data={lembretes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.two, paddingBottom: Spacing.three }}
        ListEmptyComponent={<ThemedText type="small">Nenhum lembrete enviado ainda.</ThemedText>}
        renderItem={({ item }) => (
          <Card>
            <ThemedText type="subheading">{item.titulo}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              <ThemedText type="smallBold" themeColor="textSecondary">
                {item.horario}
              </ThemedText>
              {' - '}
              {item.concluido ? 'Concluído no relógio ✓' : 'Pendente'}
            </ThemedText>
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
  lista: {
    flex: 1,
  },
});

export default HomeScreen;
