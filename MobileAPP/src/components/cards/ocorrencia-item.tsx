import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { EtiquetaTipo } from '@/components/etiqueta-tipo';
import { MarcadorFeito } from '@/components/marcador-feito';
import { TextoRiscado } from '@/components/texto-riscado';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { descreverFrequencia } from '@/utils/frequencia';

type OcorrenciaItemProps = {
  lembrete: Lembrete;
  tipo?: TipoLembrete;
  horario?: string;
  rotuloDia?: string;
  feito?: boolean;
  onAlternarFeito?: () => void;
  onAbrir: () => void;
};

export const OcorrenciaItem = ({
  lembrete,
  tipo,
  horario,
  rotuloDia,
  feito = false,
  onAlternarFeito,
  onAbrir,
}: OcorrenciaItemProps) => {
  const theme = useTheme();
  const pausado = horario === undefined;
  const corTexto = feito ? 'textSecondary' : 'text';
  const complemento = pausado
    ? `Pausado · ${lembrete.horarios.join(', ')} · ${descreverFrequencia(lembrete.dias)}`
    : rotuloDia;
  const descricao = `${rotuloDia ? `${rotuloDia}, ` : ''}${lembrete.titulo}${horario ? ` às ${horario}` : ''}`;

  return (
    <View
      style={[
        styles.card,
        feito
          ? { backgroundColor: theme.background, borderColor: theme.borderSubtle }
          : { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <Pressable
        onPress={onAbrir}
        accessibilityRole="button"
        accessibilityLabel={[descricao, tipo?.nome, pausado ? complemento : undefined, feito ? 'feito' : undefined]
          .filter(Boolean)
          .join('. ')}
        accessibilityHint="Abre os detalhes do lembrete"
        style={({ pressed }) => [styles.principal, { opacity: pressed ? 0.7 : 1 }]}>
        {!pausado && (
          <View style={styles.horario}>
            <TextoRiscado riscado={feito}>
              <ThemedText type="headline" themeColor={corTexto}>
                {horario}
              </ThemedText>
            </TextoRiscado>
          </View>
        )}
        <View style={styles.textos}>
          <TextoRiscado riscado={feito}>
            <ThemedText type="defaultBold" themeColor={corTexto} numberOfLines={feito ? 1 : 2}>
              {lembrete.titulo}
            </ThemedText>
          </TextoRiscado>
          {tipo && <EtiquetaTipo tipo={tipo} />}
          {complemento && (
            <ThemedText type="small" themeColor="textSecondary">
              {complemento}
            </ThemedText>
          )}
        </View>
        {!onAlternarFeito && (
          <SymbolView name={{ android: 'chevron_right' }} size={28} tintColor={theme.textSecondary} />
        )}
      </Pressable>

      {onAlternarFeito && (
        <MarcadorFeito feito={feito} onAlternar={onAlternarFeito} descricao={descricao} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  principal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: TouchTarget,
  },
  horario: {
    minWidth: 76,
  },
  textos: {
    flex: 1,
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
});
