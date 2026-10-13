/**
 * Tela de exemplo da comunicação celular ⇄ relógio.
 *
 * 1. Digite um lembrete e toque em "Enviar ao relógio".
 * 2. No relógio, toque no lembrete para concluí-lo.
 * 3. A confirmação volta e o item aparece como "Concluído" aqui.
 *
 * A tela só usa o hook `useWear`; não conhece o módulo nativo nem o formato das mensagens.
 */
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWear } from '@/hooks/use-wear';

export default function HomeScreen() {
  const theme = useTheme();
  const { disponivel, relogios, lembretes, enviar, atualizarRelogios } = useWear();
  const [titulo, setTitulo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);

  async function handleEnviar() {
    const texto = titulo.trim();
    if (!texto) return;
    const entregues = await enviar(texto);
    setAviso(entregues > 0 ? `Enviado para ${entregues} relógio(s).` : 'Nenhum relógio recebeu.');
    if (entregues > 0) setTitulo('');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Lembri + Relógio</ThemedText>

        {/* Status da conexão */}
        <ThemedView type="backgroundElement" style={styles.card}>
          {!disponivel ? (
            <ThemedText type="small">
              Comunicação com relógio disponível apenas no Android, em um development build
              (não funciona no Expo Go).
            </ThemedText>
          ) : (
            <>
              <ThemedText type="smallBold">
                {relogios.length > 0
                  ? `Conectado: ${relogios.map((r) => r.nome).join(', ')}`
                  : 'Nenhum relógio com o Lembri encontrado'}
              </ThemedText>
              <Pressable onPress={atualizarRelogios}>
                <ThemedText type="linkPrimary">Procurar novamente</ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>

        {/* Formulário de envio */}
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex.: Tomar remédio"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          onSubmitEditing={handleEnviar}
        />
        <Pressable
          onPress={handleEnviar}
          disabled={!disponivel || !titulo.trim()}
          style={({ pressed }) => [
            styles.botao,
            { opacity: !disponivel || !titulo.trim() ? 0.4 : pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={styles.botaoTexto}>Enviar ao relógio</ThemedText>
        </Pressable>
        {aviso && <ThemedText type="small">{aviso}</ThemedText>}

        {/* Lembretes enviados (atualizados pelas confirmações do relógio) */}
        <FlatList
          style={styles.lista}
          data={lembretes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: Spacing.two }}
          ListEmptyComponent={<ThemedText type="small">Nenhum lembrete enviado ainda.</ThemedText>}
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.item}>
              <ThemedText>{item.titulo}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.horario} · {item.concluido ? 'Concluído no relógio ✓' : 'Pendente'}
              </ThemedText>
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  input: {
    fontSize: 16,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  botao: {
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: '#208AEF',
  },
  botaoTexto: {
    color: '#ffffff',
    fontWeight: 700,
  },
  lista: {
    flex: 1,
  },
  item: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
