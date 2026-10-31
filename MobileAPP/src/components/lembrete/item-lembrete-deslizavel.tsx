import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ChipHorario } from '@/components/chip-horario';
import { EtiquetaTipo } from '@/components/etiqueta-tipo';
import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import {
  BorderWidth,
  Radius,
  Spacing,
  TouchTarget,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { descreverFrequencia } from '@/utils/frequencia';

export type ItemLembreteDeslizavelProps = {
  lembrete: Lembrete;
  tipo?: TipoLembrete;
  onAbrir: (lembrete: Lembrete) => void;
  onAlternarAtivo: (id: string) => void;
  onSolicitarExclusao: (lembrete: Lembrete) => void;
};

const LIMIAR_ARRASPAR_EXCLUIR = -80;

/**
 * Card de lembrete com gesto de arrasto horizontal (deslizar) e suporte total a acessibilidade AAA (CARD-31).
 *
 * Características WCAG 2.2 AAA:
 * - Gesto de deslizar (PanResponder) para exclusão rápida;
 * - Critério 2.5.1 (Pointer Gestures): Botão alternativo acessível e ação TalkBack `delete`
 *   para garantir que usuários impossibilitados de deslizar consigam excluir;
 * - Alvos de toque TouchTarget >= 56dp (Critério 2.5.5);
 * - Relação de contraste >= 7:1 para todos os textos informativos (Critério 1.4.6).
 */
export const ItemLembreteDeslizavel = ({
  lembrete,
  tipo,
  onAbrir,
  onAlternarAtivo,
  onSolicitarExclusao,
}: ItemLembreteDeslizavelProps) => {
  const theme = useTheme();
  const [pan] = useState(() => new Animated.Value(0));
  const frequencia = descreverFrequencia(lembrete.dias);
  const [arrastando, setArrastando] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 10;
        },
        onPanResponderGrant: () => {
          setArrastando(true);
        },
        onPanResponderMove: (_, gestureState) => {
          // Apenas permite arrastar para a esquerda (valores negativos)
          if (gestureState.dx < 0) {
            pan.setValue(Math.max(gestureState.dx, -120));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          setArrastando(false);
          if (gestureState.dx < LIMIAR_ARRASPAR_EXCLUIR) {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            onSolicitarExclusao(lembrete);
          } else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          setArrastando(false);
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [pan, lembrete, onSolicitarExclusao]
  );

  const rotuloAcessibilidade = [
    lembrete.titulo,
    tipo ? `Categoria: ${tipo.nome}` : null,
    lembrete.ativo ? 'Ativo' : 'Pausado',
    lembrete.descricao,
    `Horários: ${lembrete.horarios.join(', ')}`,
    frequencia,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View style={styles.conteinerExterno}>
      {/* Camada traseira de exclusão revelada pelo arrasto */}
      <View
        style={[
          styles.fundoAcaoExcluir,
          { backgroundColor: theme.danger, borderRadius: Radius.lg },
        ]}>
        <View style={styles.iconeExcluirTraseiro}>
          <SymbolView name={{ android: 'delete' }} size={28} tintColor={theme.onPrimary} />
          <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
            Excluir
          </ThemedText>
        </View>
      </View>

      {/* Card animado com PanResponder */}
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ translateX: pan }],
            backgroundColor: lembrete.ativo ? theme.surface : theme.background,
            borderColor: lembrete.ativo ? theme.border : theme.borderSubtle,
          },
        ]}
        {...panResponder.panHandlers}>
        <Pressable
          onPress={() => {
            if (!arrastando) onAbrir(lembrete);
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={rotuloAcessibilidade}
          accessibilityHint="Toque para ver detalhes ou deslize para a esquerda para excluir"
          accessibilityActions={[{ name: 'delete', label: 'Excluir lembrete' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'delete') {
              onSolicitarExclusao(lembrete);
            }
          }}
          style={({ pressed }) => [
            styles.conteudoPressionavel,
            { opacity: pressed && !arrastando ? 0.75 : 1 },
          ]}>
          {/* Topo do Card: Título + Switch */}
          <View style={styles.linhaTopo}>
            <View style={styles.tituloECategoria}>
              <ThemedText
                type="subheading"
                themeColor={lembrete.ativo ? 'text' : 'textSecondary'}
                numberOfLines={2}>
                {lembrete.titulo}
              </ThemedText>
              {tipo && <EtiquetaTipo tipo={tipo} />}
            </View>

            <View style={styles.acoesTopo}>
              {/* Botão de exclusão acessível visível (WCAG 2.5.1 alternativo ao deslizar) */}
              <Pressable
                onPress={() => onSolicitarExclusao(lembrete)}
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${lembrete.titulo}`}
                accessibilityHint="Abre o diálogo de confirmação de exclusão"
                style={({ pressed }) => [
                  styles.botaoExcluirAcessivel,
                  { opacity: pressed ? 0.6 : 1 },
                ]}>
                <SymbolView
                  name={{ android: 'delete_outline' }}
                  size={22}
                  tintColor={theme.textSecondary}
                />
              </Pressable>

              <Interruptor
                ligado={lembrete.ativo}
                onAlternar={() => onAlternarAtivo(lembrete.id)}
                accessibilityLabel={`Alertas de ${lembrete.titulo}: ${lembrete.ativo ? 'ligados' : 'pausados'}`}
              />
            </View>
          </View>

          {/* Descrição se houver */}
          {lembrete.descricao ? (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
              {lembrete.descricao}
            </ThemedText>
          ) : null}

          {/* Rodapé do Card: Chips de horários à esquerda e Frequência à direita */}
          <View style={styles.linhaRodape}>
            <View style={styles.chipsEIcone}>
              <SymbolView
                name={{ android: 'schedule' }}
                size={18}
                tintColor={theme.textSecondary}
              />
              <View style={styles.gradeChips}>
                {lembrete.horarios.map((h) => (
                  <ChipHorario key={h} horario={h} />
                ))}
              </View>
            </View>

            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.textoFrequencia}>
              {frequencia}
            </ThemedText>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteinerExterno: {
    position: 'relative',
    marginVertical: Spacing.one,
  },
  fundoAcaoExcluir: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: Spacing.four,
  },
  iconeExcluirTraseiro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  cardWrapper: {
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
    overflow: 'hidden',
  },
  conteudoPressionavel: {
    padding: Spacing.three,
    gap: Spacing.two,
    minHeight: TouchTarget,
  },
  linhaTopo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  tituloECategoria: {
    flex: 1,
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
  acoesTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  botaoExcluirAcessivel: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  chipsEIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    flexShrink: 1,
  },
  gradeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  textoFrequencia: {
    flexShrink: 0,
  },
});
