import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ListaVaziaLembretesProps = {
  onNovo: () => void;
};

/**
 * Componente de estado vazio da lista de lembretes (Frame Figma 152:1538 - CARD-31).
 *
 * Apresenta a mensagem oficial em tipografia de destaque "Nenhum Lembrete Foi Encontrado",
 * ícone representativo e botão de ação imediata "+ Novo" (WCAG 2.2 AAA — TouchTarget = 56dp).
 */
export const ListaVaziaLembretes = ({ onNovo }: ListaVaziaLembretesProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconeContainer,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <SymbolView name={{ android: 'notifications_off' }} size={44} tintColor={theme.textSecondary} />
      </View>

      <View style={styles.textos}>
        <ThemedText type="subheading" style={styles.tituloCentral}>
          Nenhum Lembrete Foi Encontrado
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.descricaoCentral}>
          Crie seu primeiro lembrete para receber avisos de remédios, tarefas e compromissos.
        </ThemedText>
      </View>

      <Botao
        rotulo="+ Novo"
        variante="primario"
        onPress={onNovo}
        accessibilityLabel="Criar novo lembrete"
        style={styles.botao}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four * 2,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  iconeContainer: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: Spacing.one,
  },
  textos: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  tituloCentral: {
    textAlign: 'center',
  },
  descricaoCentral: {
    textAlign: 'center',
    maxWidth: 320,
  },
  botao: {
    marginTop: Spacing.two,
    minWidth: 160,
    minHeight: TouchTarget,
  },
});
