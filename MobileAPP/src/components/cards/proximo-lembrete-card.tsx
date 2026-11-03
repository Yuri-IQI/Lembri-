import { Pressable, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Gradients, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { OcorrenciaLembrete } from '@/types/lembrete';

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
  const actionLabel = feito
    ? 'Desfazer conclusão'
    : lembrete.template === 'remedio' ? 'Marcar como tomado' : 'Marcar como feito';

  return (
    <View style={[styles.card, fundo]}>
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
        <Botao
          rotulo={actionLabel}
          icone={feito ? 'undo' : 'check'}
          variante={feito ? 'secundario' : 'primario'}
          onPress={onAlternarFeito}
          accessibilityLabel={`${actionLabel}: ${lembrete.titulo}, ${quando}`}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.lg,
  },
  conteudo: {
    gap: Spacing.one,
  },
});
