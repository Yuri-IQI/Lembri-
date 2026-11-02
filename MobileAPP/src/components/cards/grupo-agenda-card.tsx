import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChipOcorrencia, type EstadoHorario } from '@/components/etiquetas/chip-ocorrencia';
import { IconeTemplate } from '@/components/itens/icone-template';
import { Interruptor } from '@/components/controles/interruptor';
import { ListaEtiquetas } from '@/components/etiquetas/lista-etiquetas';
import { TextoRiscado } from '@/components/itens/texto-riscado';
import { ThemedText } from '@/components/themed-text';
import { JANELA_REMEDIO_MINUTOS } from '@/constants/limites';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { obterTemplate } from '@/mocks/templates-lembrete.mock';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { resumoDoLembrete } from '@/utils/lembrete/detalhes-lembrete';
import { descreverAgenda, horariosDoLembrete, rotuloFeito } from '@/utils/lembrete/lembrete';

export type HorarioDoCard = {
  chave: string;
  horario: string;
  estado: EstadoHorario;
  onAlternar?: () => void;
};

type GrupoAgendaCardProps = {
  lembrete: Lembrete;
  tipos: TipoLembrete[];
  horarios: HorarioDoCard[];
  onAbrir: () => void;
  onRemover?: () => void;
  rotuloRemover?: string;
  consulta?: boolean;
  interruptor?: { ligado: boolean; onAlternar: () => void };
};

export const GrupoAgendaCard = ({
  lembrete,
  tipos,
  horarios,
  onAbrir,
  onRemover,
  rotuloRemover = 'Tirar da lista',
  consulta = false,
  interruptor,
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
  const foraDaJanela =
    !consulta && lembrete.template === 'remedio' && horarios.some((item) => !item.onAlternar);

  return (
    <View
      style={[
        styles.card,
        feito
          ? { backgroundColor: theme.background, borderColor: theme.borderSubtle }
          : { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <View style={styles.linha}>
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
          ].filter(Boolean).join('. ')}
          accessibilityHint="Abre os detalhes do lembrete"
          accessibilityActions={onRemover ? [{ name: 'remover', label: rotuloRemover }] : undefined}
          onAccessibilityAction={(evento) =>
            evento.nativeEvent.actionName === 'remover' && onRemover?.()
          }
          style={({ pressed }) => [styles.principal, { opacity: pressed ? 0.6 : 0.8 }]}>
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
          {!interruptor && (
            <SymbolView
              name={{ android: 'chevron_right' }}
              size={32}
              tintColor={theme.textSecondary}
            />
          )}
        </Pressable>
        {interruptor && (
          <Interruptor
            ligado={interruptor.ligado}
            onAlternar={interruptor.onAlternar}
            accessibilityLabel={`Alertar ${lembrete.titulo}`}
          />
        )}
      </View>

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

      {foraDaJanela && (
        <ThemedText type="small" themeColor="textSecondary">
          {`Dá para marcar de ${JANELA_REMEDIO_MINUTOS.antes} minutos antes até ${JANELA_REMEDIO_MINUTOS.depois} minutos depois do horário.`}
        </ThemedText>
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  principal: {
    flex: 1,
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
