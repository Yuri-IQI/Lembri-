import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChipOcorrencia, type EstadoHorario } from '@/components/chip-ocorrencia';
import { IconeTemplate } from '@/components/icone-template';
import { ListaEtiquetas } from '@/components/lista-etiquetas';
import { TextoRiscado } from '@/components/texto-riscado';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { obterTemplate } from '@/mocks/templates-lembrete.mock';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { resumoDoLembrete } from '@/utils/detalhes-lembrete';
import { descreverAgenda, horariosDoLembrete, rotuloFeito } from '@/utils/lembrete';

export type HorarioDoCard = {
  chave: string;
  horario: string;
  estado: EstadoHorario;
  onAlternar?: () => void;
};

type GrupoAgendaCardProps = {
  lembrete: Lembrete;
  tipos: TipoLembrete[];
  /** Horários do lembrete no dia; vazio quando ele está pausado. */
  horarios: HorarioDoCard[];
  onAbrir: () => void;
  /** Tira o card da lista (também oferecido ao leitor de tela). */
  onRemover?: () => void;
  /** Seção "Todos": mostra quando o lembrete repete; os horários só informam. */
  consulta?: boolean;
};

/**
 * Um lembrete num dia: ícone do template, título, tipos e os horários do dia como etiquetas que
 * marcam o feito.
 */
export const GrupoAgendaCard = ({
  lembrete,
  tipos,
  horarios,
  onAbrir,
  onRemover,
  consulta = false,
}: GrupoAgendaCardProps) => {
  const theme = useTheme();
  const pausado = horarios.length === 0;
  const feito = !consulta && !pausado && horarios.every((item) => item.estado === 'feito');
  const atrasado = horarios.some((item) => item.estado === 'nao_marcado');
  const corTexto = feito ? 'textSecondary' : atrasado ? 'danger' : 'text';
  const complemento = pausado
    ? `Pausado · ${horariosDoLembrete(lembrete).join(', ')} · ${descreverAgenda(lembrete)}`
    : consulta
      ? [descreverAgenda(lembrete), resumoDoLembrete(lembrete)].filter(Boolean).join(' · ')
      : resumoDoLembrete(lembrete);

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
        accessibilityLabel={[
          obterTemplate(lembrete.template).nome,
          lembrete.titulo,
          ...tipos.map((tipo) => tipo.nome),
          complemento,
          feito ? 'feito' : undefined,
          atrasado ? 'tem horário não marcado' : undefined,
        ]
          .filter(Boolean)
          .join('. ')}
        accessibilityHint="Abre os detalhes do lembrete"
        accessibilityActions={
          onRemover ? [{ name: 'remover', label: 'Tirar da lista' }] : undefined
        }
        onAccessibilityAction={(evento) =>
          evento.nativeEvent.actionName === 'remover' && onRemover?.()
        }
        style={({ pressed }) => [styles.principal, { opacity: pressed ? 0.7 : 1 }]}>
        <IconeTemplate template={lembrete.template} />
        <View style={styles.textos}>
          <TextoRiscado riscado={feito}>
            <ThemedText type="defaultBold" themeColor={corTexto} numberOfLines={2}>
              {lembrete.titulo}
            </ThemedText>
          </TextoRiscado>
          <ListaEtiquetas tipos={tipos} />
          {complemento && (
            <ThemedText type="small" themeColor="textSecondary">
              {complemento}
            </ThemedText>
          )}
        </View>
        <SymbolView name={{ android: 'chevron_right' }} size={28} tintColor={theme.textSecondary} />
      </Pressable>

      {!pausado && (
        <View style={styles.horarios}>
          {horarios.map((item) => (
            <ChipOcorrencia
              key={item.chave}
              horario={item.horario}
              estado={item.estado}
              descricao={`${rotuloFeito(lembrete)}: ${lembrete.titulo}`}
              onAlternar={item.onAlternar}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  principal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: TouchTarget,
  },
  textos: {
    flex: 1,
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  horarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
