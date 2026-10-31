import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TemplateLembrete } from '@/types/template-lembrete';

type CardTemplateProps = {
  template: TemplateLembrete;
  onEscolher: () => void;
};

/**
 * Card de um template na tela "Novo lembrete": ícone, nome e exemplo de uso.
 */
export const CardTemplate = ({ template, onEscolher }: CardTemplateProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onEscolher}
      accessibilityRole="button"
      accessibilityLabel={`${template.nome}. ${template.exemplo}`}
      accessibilityHint="Abre o formulário deste tipo de lembrete"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}>
      <View style={[styles.icone, { backgroundColor: theme.accent }]}>
        <SymbolView name={{ android: template.icone }} size={32} tintColor={theme.text} />
      </View>
      <View style={styles.textos}>
        <ThemedText type="subheading">{template.nome}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {template.exemplo}
        </ThemedText>
      </View>
      <SymbolView name={{ android: 'chevron_right' }} size={32} tintColor={theme.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: TouchTarget,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  icone: {
    width: ComponentSize.iconeTemplate,
    height: ComponentSize.iconeTemplate,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: Spacing.one,
  },
});
