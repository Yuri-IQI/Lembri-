import { Pressable, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { IconeExercicio } from '@/components/exercicio/icone-exercicio';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercicio } from '@/types/exercicio';
import { plural } from '@/utils/texto/texto';

export interface ExercicioCardProps {
  exercicio: Exercicio;
  ultimaAtividade: string;
  diasSeguidos: number;
  onComecar: () => void;
  onDetalhes: () => void;
}

export const ExercicioCard = ({
  exercicio,
  ultimaAtividade,
  diasSeguidos,
  onComecar,
  onDetalhes,
}: ExercicioCardProps) => {
  const theme = useTheme();
  const sequencia = plural(diasSeguidos, 'dia seguido', 'dias seguidos');
  const origem = exercicio.somenteRelogio ? ' Exercício do relógio.' : '';

  return (
    <Pressable
      onPress={onDetalhes}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes do exercício ${exercicio.titulo}.${origem} ${ultimaAtividade}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <Card style={styles.card}>
        <View style={styles.cabecalho}>
          <View
            style={[styles.areaIcone, { backgroundColor: theme.accentLight }]}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}>
            <IconeExercicio icone={exercicio.icone} />
          </View>

          <View style={styles.info}>
            <ThemedText type="subheading" style={styles.titulo}>
              {exercicio.titulo}
            </ThemedText>
            {exercicio.somenteRelogio && (
              <View
                style={[
                  styles.etiqueta,
                  { backgroundColor: theme.accentLight, borderColor: theme.divider },
                ]}>
                <ThemedText type="smallBold">Exercício do relógio</ThemedText>
              </View>
            )}
            <ThemedText type="small" themeColor="textSecondary">
              {ultimaAtividade}
            </ThemedText>
            {diasSeguidos > 0 && (
              <ThemedText type="small">{sequencia}</ThemedText>
            )}
          </View>
        </View>

        {!exercicio.somenteRelogio && (
          <Botao
            rotulo="COMEÇAR"
            variante="primario"
            onPress={onComecar}
            accessibilityLabel={`Começar exercício ${exercicio.titulo}`}
            style={styles.botao}
          />
        )}
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  areaIcone: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 30,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
  botao: {
    marginTop: Spacing.one,
  },
});
