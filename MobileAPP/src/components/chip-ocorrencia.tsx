import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, ComponentSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type EstadoHorario = 'pendente' | 'feito' | 'nao_marcado';

type ChipOcorrenciaProps = {
  horario: string;
  estado: EstadoHorario;
  /** Usado pelo leitor de tela: "Tomei: Losartana". */
  descricao: string;
  onAlternar?: () => void;
};

const ICONE = { feito: 'check', nao_marcado: 'close', pendente: 'schedule' } as const;

/**
 * Horário de um lembrete num dia. Tocando, marca ou desmarca como feito; feito fica verde.
 */
export const ChipOcorrencia = ({ horario, estado, descricao, onAlternar }: ChipOcorrenciaProps) => {
  const theme = useTheme();
  const feito = estado === 'feito';
  const cor = estado === 'nao_marcado' ? 'danger' : 'text';
  const conteudo = (
    <>
      <SymbolView name={{ android: ICONE[estado] }} size={20} tintColor={theme[cor]} />
      <ThemedText type="smallBold" themeColor={cor}>
        {horario}
      </ThemedText>
    </>
  );
  const estilo = [
    styles.chip,
    {
      backgroundColor: feito ? theme.success : theme.surface,
      borderColor: feito ? theme.primary : estado === 'nao_marcado' ? theme.danger : theme.border,
    },
  ];
  const situacao = feito ? 'feito' : estado === 'nao_marcado' ? 'não marcado' : 'ainda não feito';

  if (!onAlternar) {
    return (
      <View style={estilo} accessible accessibilityLabel={`${horario}, ${situacao}`}>
        {conteudo}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onAlternar}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: feito }}
      accessibilityLabel={`${descricao} às ${horario}`}
      style={({ pressed }) => [estilo, { opacity: pressed ? 0.6 : 1 }]}>
      {conteudo}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: ComponentSize.chipMarcavel,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three - Spacing.one,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.thin,
  },
});
