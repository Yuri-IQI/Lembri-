import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, getScaledTypography, LabelTextFitting, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { corDeTextoLegivel } from '@/utils/cor/contraste';
import { fitWordSpacing } from '@/utils/fit-word-spacing';

type EtiquetaTipoProps = {
  tipo: TipoLembrete;
};

export const EtiquetaTipo = ({ tipo }: EtiquetaTipoProps) => {
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  const fontSize = getScaledTypography('smallBold', theme.isLargeText).fontSize ?? theme.typography.smallBold.fontSize;
  const signature = `${fontSize}:${fontScale}:`;
  const words = useMemo(() => [...new Set(tipo.nome.trim().split(/\s+/))], [tipo.nome]);
  const samples = useMemo(() => [...new Set([tipo.nome, ...words])], [tipo.nome, words]);
  const [measurements, setMeasurements] = useState<Record<string, number>>({});
  const [availableWidth, setAvailableWidth] = useState(0);
  const naturalWidth = measurements[signature + tipo.nome];
  const letterSpacing = fitWordSpacing(words.map((text) => ({
    text, width: measurements[signature + text] ?? 0,
  })), availableWidth, fontSize);
  const measurementWidth = Math.max(1, Array.from(tipo.nome).length) * fontSize * fontScale * LabelTextFitting.measurementWidthMultiplier;

  return (
    <View
      style={[styles.etiqueta, {
        backgroundColor: tipo.corHex,
        borderColor: theme.divider,
        width: naturalWidth === undefined ? undefined : naturalWidth + (Spacing.one + BorderWidth.thin) * 2,
      }]}
      accessible
      accessibilityLabel={`Categoria: ${tipo.nome}`}>
      <ThemedText type="smallBold"
        onLayout={(event) => setAvailableWidth(event.nativeEvent.layout.width)}
        style={[styles.texto, { color: corDeTextoLegivel(tipo.corHex), letterSpacing }]}>
        {tipo.nome}
      </ThemedText>
      <View pointerEvents="none" accessible={false} accessibilityElementsHidden aria-hidden importantForAccessibility="no-hide-descendants"
        style={[styles.measurements, { width: measurementWidth }]}>
        {samples.map((sample) => <ThemedText key={signature + sample} type="smallBold" numberOfLines={1}
          selectable={false} style={styles.sample}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            const key = signature + sample;
            setMeasurements((previous) => previous[key] === width ? previous : { ...previous, [key]: width });
          }}>{sample}</ThemedText>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  etiqueta: {
    maxWidth: '100%',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
  texto: {
    flexShrink: 1,
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  measurements: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    alignItems: 'flex-start',
  },
  sample: {
    flexShrink: 0,
    alignSelf: 'flex-start',
    letterSpacing: 0,
  },
});
