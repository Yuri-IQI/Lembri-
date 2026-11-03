import { StyleSheet, View } from 'react-native';

import { MaterialSymbol } from '@/components/material-symbol';
import { ComponentSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { obterTemplate } from '@/mocks/templates-lembrete.mock';
import type { TemplateId } from '@/types/lembrete';

export const IconeTemplate = ({ template }: { template: TemplateId }) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.circulo, { backgroundColor: theme.accentLight }]}
      importantForAccessibility="no-hide-descendants">
      <MaterialSymbol
        name={obterTemplate(template).icone}
        size={32}
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
