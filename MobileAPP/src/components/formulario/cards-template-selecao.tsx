import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TemplateOpcao = 'remedio' | 'compromisso' | 'livre';

export type CardsTemplateSelecaoProps = {
  onSelecionar: (template: TemplateOpcao) => void;
};

const TEMPLATES: {
  id: TemplateOpcao;
  titulo: string;
  descricao: string;
  icone: AndroidSymbol;
}[] = [
  {
    id: 'remedio',
    titulo: 'Remédio',
    descricao: 'Para remédios diários com múltiplos horários e alerta de confirmação ativo.',
    icone: 'medication',
  },
  {
    id: 'compromisso',
    titulo: 'Compromisso',
    descricao: 'Para consultas, eventos ou tarefas pontuais com horário marcado.',
    icone: 'calendar_today',
  },
  {
    id: 'livre',
    titulo: 'Livre',
    descricao: 'Modelo aberto sem pré-configurações para você preencher do seu jeito.',
    icone: 'edit_note',
  },
];

/**
 * Passo 1 do fluxo de criação de lembretes: Seleção de Templates (CARD-33).
 *
 * Características WCAG 2.2 AAA:
 * - Cards com alvos de toque generosos (mínimo TouchTarget = 56dp);
 * - Alto contraste e feedback visual ao pressionar;
 * - Anúncio semântico claro para leitores de tela com accessibilityRole="button".
 */
export const CardsTemplateSelecao = ({ onSelecionar }: CardsTemplateSelecaoProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        Escolha um modelo para começar
      </ThemedText>

      <View style={styles.grade}>
        {TEMPLATES.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelecionar(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Modelo ${item.titulo}: ${item.descricao}`}
            accessibilityHint="Seleciona este modelo e abre o formulário de configuração"
            style={({ pressed }) => [
              styles.cardPressionavel,
              { opacity: pressed ? 0.75 : 1 },
            ]}>
            <Card style={[styles.card, { borderColor: theme.border }]}>
              <View
                style={[
                  styles.iconeContainer,
                  { backgroundColor: theme.chipSelected, borderColor: theme.primary },
                ]}>
                <SymbolView
                  name={{ android: item.icone }}
                  size={32}
                  tintColor={theme.primary}
                />
              </View>

              <View style={styles.textos}>
                <ThemedText type="subheading">{item.titulo}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.descricao}
                </ThemedText>
              </View>

              <SymbolView
                name={{ android: 'arrow_forward' }}
                size={24}
                tintColor={theme.textSecondary}
              />
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  grade: {
    gap: Spacing.three,
  },
  cardPressionavel: {
    minHeight: TouchTarget,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  iconeContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BorderWidth.hairline,
  },
  textos: {
    flex: 1,
    gap: Spacing.one,
  },
});
