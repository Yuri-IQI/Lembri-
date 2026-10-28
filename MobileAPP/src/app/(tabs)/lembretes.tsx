import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { FiltroLembrete, Lembrete } from '@/types/lembrete';

/**
 * Tela principal de gerenciamento e visualização de lembretes.
 * Consome dados reativos da store Zustand com suporte a filtros e reversibilidade (Undo).
 */
const LembretesScreen = () => {
  const theme = useTheme();

  const {
    lembretes,
    filtro,
    ultimoExcluido,
    toggleConcluido,
    removerLembrete,
    desfazerExclusao,
    definirFiltro,
    resetarParaMocks,
  } = useLembretesStore(
    useShallow((state) => ({
      lembretes: state.lembretes,
      filtro: state.filtro,
      ultimoExcluido: state.ultimoExcluido,
      toggleConcluido: state.toggleConcluido,
      removerLembrete: state.removerLembrete,
      desfazerExclusao: state.desfazerExclusao,
      definirFiltro: state.definirFiltro,
      resetarParaMocks: state.resetarParaMocks,
    }))
  );

  const tipos = useTiposLembreteStore((state) => state.tipos);

  // Mapeia categorias por id para resolução rápida
  const mapaTipos = useMemo(() => {
    return new Map(tipos.map((t) => [t.id, t]));
  }, [tipos]);

  // Filtra itens com base no estado ativo
  const lembretesFiltrados = useMemo(() => {
    if (filtro === 'pendentes') {
      return lembretes.filter((item) => !item.concluido);
    }
    if (filtro === 'concluidos') {
      return lembretes.filter((item) => item.concluido);
    }
    return lembretes;
  }, [lembretes, filtro]);

  const filtros: { chave: FiltroLembrete; rotulo: string }[] = [
    { chave: 'todos', rotulo: 'Todos' },
    { chave: 'pendentes', rotulo: 'Pendentes' },
    { chave: 'concluidos', rotulo: 'Concluídos' },
  ];

  const renderItem = ({ item }: { item: Lembrete }) => {
    const tipo = item.tipoId ? mapaTipos.get(item.tipoId) : undefined;
    const statusTexto = item.concluido
      ? item.concluidoNoWear
        ? 'Concluído no relógio ✓'
        : 'Concluído no celular ✓'
      : 'Pendente';

    return (
      <Card style={styles.cardLembrete}>
        <View style={styles.cardHeader}>
          {tipo ? (
            <View
              style={[
                styles.badgeTipo,
                { backgroundColor: theme.accentLight, borderColor: theme.borderSubtle },
              ]}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Categoria: ${tipo.nome}`}>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                {tipo.nome}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.badgeEspaco} />
          )}

          <ThemedText type="smallBold" themeColor="textSecondary">
            {item.horario}
          </ThemedText>
        </View>

        <ThemedText type="subheading" style={item.concluido ? styles.textoConcluido : undefined}>
          {item.titulo}
        </ThemedText>

        <ThemedText type="small" themeColor="textSecondary">
          {statusTexto}
        </ThemedText>

        <View style={styles.acoesContainer}>
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              item.concluido
                ? `Marcar ${item.titulo} como pendente`
                : `Marcar ${item.titulo} como concluído`
            }
            onPress={() => toggleConcluido(item.id)}
            style={({ pressed }) => [
              styles.botaoAcao,
              { backgroundColor: item.concluido ? theme.surface : theme.primary },
              { borderColor: theme.border },
              pressed && styles.botaoPressionado,
            ]}>
            <ThemedText
              type="smallBold"
              style={{ color: item.concluido ? theme.text : theme.onPrimary }}>
              {item.concluido ? 'Reabrir' : 'Concluir'}
            </ThemedText>
          </Pressable>

          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Excluir lembrete ${item.titulo}`}
            onPress={() => removerLembrete(item.id)}
            style={({ pressed }) => [
              styles.botaoAcao,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && styles.botaoPressionado,
            ]}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Excluir
            </ThemedText>
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <MainContainer>
      {/* Seletor de Filtros (Chips de Toque Acessíveis) */}
      <View style={styles.filtrosContainer}>
        {filtros.map((itemFiltro) => {
          const ativo = filtro === itemFiltro.chave;
          return (
            <Pressable
              key={itemFiltro.chave}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={`Filtrar por ${itemFiltro.rotulo}`}
              onPress={() => definirFiltro(itemFiltro.chave)}
              style={({ pressed }) => [
                styles.chipFiltro,
                {
                  backgroundColor: ativo ? theme.primary : theme.surface,
                  borderColor: ativo ? theme.primary : theme.border,
                },
                pressed && styles.botaoPressionado,
              ]}>
              <ThemedText
                type="smallBold"
                style={{ color: ativo ? theme.onPrimary : theme.text }}>
                {itemFiltro.rotulo}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Banner de Undo / Desfazer Exclusão (WCAG 3.3.6) */}
      {ultimoExcluido && (
        <Card style={styles.cardUndo}>
          <ThemedText type="smallBold">
            Lembrete &quot;{ultimoExcluido.titulo}&quot; excluído.
          </ThemedText>
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Desfazer exclusão do lembrete ${ultimoExcluido.titulo}`}
            onPress={desfazerExclusao}
            style={({ pressed }) => [
              styles.botaoDesfazer,
              { backgroundColor: theme.primary },
              pressed && styles.botaoPressionado,
            ]}>
            <ThemedText type="smallBold" themeColor="onPrimary">
              Desfazer
            </ThemedText>
          </Pressable>
        </Card>
      )}

      {/* Lista Principal de Lembretes */}
      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          <Card style={styles.cardVazio}>
            <ThemedText type="subheading">Nenhum lembrete nesta lista</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Você pode restaurar os exemplos de demonstração a qualquer momento.
            </ThemedText>
            <Pressable
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Restaurar dados de demonstração do Figma"
              onPress={resetarParaMocks}
              style={({ pressed }) => [
                styles.botaoRestaurar,
                { backgroundColor: theme.primary },
                pressed && styles.botaoPressionado,
              ]}>
              <ThemedText type="button" themeColor="onPrimary">
                Restaurar Exemplos
              </ThemedText>
            </Pressable>
          </Card>
        }
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  filtrosContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  chipFiltro: {
    minHeight: TouchTarget,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Spacing.two,
  },
  listaConteudo: {
    gap: Spacing.two,
    paddingBottom: Spacing.five,
  },
  cardLembrete: {
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTipo: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.thin,
  },
  badgeEspaco: {
    height: 24,
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  botaoAcao: {
    minHeight: TouchTarget,
    minWidth: TouchTarget,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Spacing.two,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  cardUndo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  botaoDesfazer: {
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  cardVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  botaoRestaurar: {
    minHeight: TouchTarget,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
});

export default LembretesScreen;
