import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChipHorario } from '@/components/chip-horario';
import { EtiquetaTipo } from '@/components/etiqueta-tipo';
import { MarcadorFeito } from '@/components/marcador-feito';
import { TextoRiscado } from '@/components/texto-riscado';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { descreverAgenda, horariosDoLembrete, rotuloFeito, textoDeApoio } from '@/utils/lembrete';

export type LembreteCardProps = {
  lembrete: Lembrete;
  tipo?: TipoLembrete;
  feito?: boolean;
  onAlternarFeito?: () => void;
  onAbrir: () => void;
};

/**
 * Card completo de exibição de lembrete (CARD-24).
 *
 * Apresenta título, etiqueta de categoria (se houver), descrição curta opcional,
 * chips de horários programados, repetição descritiva e sinalização acessível de status
 * feito/pendente com texto e ícone (WCAG 1.4.1).
 */
export const LembreteCard = ({
  lembrete,
  tipo,
  feito = false,
  onAlternarFeito,
  onAbrir,
}: LembreteCardProps) => {
  const theme = useTheme();
  const corTexto = feito ? 'textSecondary' : 'text';
  const frequencia = descreverAgenda(lembrete);
  const horarios = horariosDoLembrete(lembrete);
  const apoio = textoDeApoio(lembrete);
  const statusTexto = feito ? 'Concluído' : 'Pendente';

  const rotuloAcessibilidade = [
    lembrete.titulo,
    tipo?.nome,
    apoio,
    `Horários: ${horarios.join(', ')}`,
    frequencia,
    `Status: ${statusTexto}`,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: feito ? theme.background : theme.surface,
          borderColor: feito ? theme.borderSubtle : theme.border,
        },
      ]}>
      <Pressable
        onPress={onAbrir}
        accessibilityRole="button"
        accessibilityLabel={rotuloAcessibilidade}
        accessibilityHint="Abre os detalhes do lembrete"
        style={({ pressed }) => [styles.principal, { opacity: pressed ? 0.7 : 1 }]}>
        <View style={styles.conteudo}>
          <View style={styles.topo}>
            <View style={styles.identificacao}>
              <TextoRiscado riscado={feito}>
                <ThemedText type="subheading" themeColor={corTexto} numberOfLines={2}>
                  {lembrete.titulo}
                </ThemedText>
              </TextoRiscado>
              {tipo && <EtiquetaTipo tipo={tipo} />}
            </View>
            <View style={styles.statusBadge} accessible={true} accessibilityRole="text">
              <SymbolView
                name={{ android: feito ? 'check_circle' : 'schedule' }}
                size={16}
                tintColor={feito ? theme.primary : theme.textSecondary}
              />
              <ThemedText
                type="smallBold"
                themeColor={feito ? 'text' : 'textSecondary'}
                style={styles.statusTexto}>
                {statusTexto}
              </ThemedText>
            </View>
          </View>

          {apoio ? (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
              {apoio}
            </ThemedText>
          ) : null}

          {horarios.length > 0 ? (
            <View style={styles.chipsHorarios}>
              {horarios.map((horario) => (
                <ChipHorario key={horario} horario={horario} />
              ))}
            </View>
          ) : null}

          <ThemedText type="small" themeColor="textSecondary">
            {frequencia}
          </ThemedText>
        </View>

        {!onAlternarFeito && (
          <View style={styles.setaContainer}>
            <SymbolView
              name={{ android: 'chevron_right' }}
              size={28}
              tintColor={theme.textSecondary}
            />
          </View>
        )}
      </Pressable>

      {onAlternarFeito && (
        <MarcadorFeito
          feito={feito}
          onAlternar={onAlternarFeito}
          descricao={`${lembrete.titulo}, ${statusTexto}`}
          rotulo={rotuloFeito(lembrete)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  principal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: TouchTarget,
  },
  conteudo: {
    flex: 1,
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  topo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  identificacao: {
    flex: 1,
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  statusTexto: {
    marginLeft: 2,
  },
  chipsHorarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  setaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: Spacing.two,
  },
});
