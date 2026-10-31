import { Pressable, StyleSheet, View } from 'react-native';

import { MarcadorFeito } from '@/components/marcador-feito';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Gradients, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { OcorrenciaLembrete } from '@/types/lembrete';
import { rotuloFeito } from '@/utils/lembrete';

type ProximoLembreteCardProps = {
  ocorrencia: OcorrenciaLembrete | null;
  quando: string;
  feito: boolean;
  onAlternarFeito?: () => void;
  onAbrir: (ocorrencia: OcorrenciaLembrete) => void;
};

export const ProximoLembreteCard = ({
  ocorrencia,
  quando,
  feito,
  onAlternarFeito,
  onAbrir,
}: ProximoLembreteCardProps) => {
  const theme = useTheme();
  const fundo = {
    borderColor: theme.border,
    backgroundImage: Gradients.proximoLembrete(feito, theme),
  };

  if (!ocorrencia) return null;

  const { lembrete } = ocorrencia;

  return (
    <View style={[styles.card, styles.linha, fundo]}>
      <Pressable
        onPress={() => onAbrir(ocorrencia)}
        accessibilityRole="button"
        accessibilityLabel={`Próximo lembrete: ${lembrete.titulo}, ${quando}${feito ? '. Feito' : ''}`}
        accessibilityHint="Abre os detalhes do lembrete"
        style={({ pressed }) => [styles.conteudo, { opacity: pressed ? 0.7 : 1 }]}>
        <ThemedText type="label">Próximo lembrete</ThemedText>
        <ThemedText type="headline" numberOfLines={2}>
          {lembrete.titulo}
        </ThemedText>
        <ThemedText type="defaultBold">{quando}</ThemedText>
      </Pressable>
      {onAlternarFeito && (
        <MarcadorFeito
          feito={feito}
          onAlternar={onAlternarFeito}
          descricao={`${lembrete.titulo}, ${quando}`}
          rotulo={rotuloFeito(lembrete)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.lg,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  conteudo: {
    flex: 1,
    gap: Spacing.one,
  },
});
