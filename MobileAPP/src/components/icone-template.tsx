import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ComponentSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { obterTemplate } from '@/mocks/templates-lembrete.mock';
import type { TemplateId } from '@/types/lembrete';

/**
 * Ícone do template do lembrete (remédio, compromisso, tarefa, livre) num círculo de destaque.
 * O nome do template deve ser lido pelo elemento pai.
 */
export const IconeTemplate = ({ template }: { template: TemplateId }) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.circulo, { backgroundColor: theme.accentLight }]}
      importantForAccessibility="no-hide-descendants">
      <SymbolView
        name={{ android: obterTemplate(template).icone }}
        size={24}
        tintColor={theme.text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  circulo: {
    width: ComponentSize.iconeTemplateCard,
    height: ComponentSize.iconeTemplateCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
});
