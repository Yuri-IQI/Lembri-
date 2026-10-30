import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { corDeTextoLegivel } from '@/utils/contraste';

type EtiquetaTipoProps = {
  tipo: TipoLembrete;
};

export const EtiquetaTipo = ({ tipo }: EtiquetaTipoProps) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.etiqueta, { backgroundColor: tipo.corHex, borderColor: theme.divider }]}
      accessible
      accessibilityLabel={`Categoria: ${tipo.nome}`}>
      <ThemedText type="smallBold" style={{ color: corDeTextoLegivel(tipo.corHex) }}>
        {tipo.nome}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
});
