import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { ItemLembreteDeslizavel } from '@/components/lembrete/item-lembrete-deslizavel';
import { ListaVaziaLembretes } from '@/components/lembrete/lista-vazia-lembretes';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { Lembrete } from '@/types/lembrete';

/**
 * Aba oficial de Lembretes do Lembri (Frames Figma 152:1440 e 152:1538 - CARD-31).
 *
 * Apresenta o cabeçalho "Seus Lembretes", o contador reativo de ativos vs total (RN-01),
 * botão de ação primária "+ Novo" e listagem com gesto de deslizar e acessibilidade WCAG 2.2 AAA.
 */
const LembretesTabScreen = () => {
  const { lembretes, alternarAtivo, removerLembrete } = useLembretesStore(
    useShallow((state) => ({
      lembretes: state.lembretes,
      alternarAtivo: state.alternarAtivo,
      removerLembrete: state.removerLembrete,
    }))
  );

  const tipos = useTiposLembreteStore((state) => state.tipos);
  const [lembreteParaExcluir, setLembreteParaExcluir] = useState<Lembrete | null>(null);

  const mapaTipos = useMemo(() => {
    return new Map(tipos.map((t) => [t.id, t]));
  }, [tipos]);

  const ativos = useMemo(() => {
    return lembretes.filter((l) => l.ativo).length;
  }, [lembretes]);

  const total = lembretes.length;
  const textoContador = `${ativos} de ${total} ativos`;

  const handleNovo = () => {
    router.push('/lembrete/novo' as const);
  };

  const handleAbrir = (lembrete: Lembrete) => {
    router.push({
      pathname: '/lembrete/[id]' as const,
      params: { id: lembrete.id },
    });
  };

  const confirmarExclusao = () => {
    if (lembreteParaExcluir) {
      removerLembrete(lembreteParaExcluir.id);
      setLembreteParaExcluir(null);
    }
  };

  return (
    <MainContainer style={styles.container}>
      {/* Cabeçalho da página (Título Seus Lembretes + Linha Contador e Botão + Novo) */}
      <View style={styles.cabecalho}>
        <ThemedText type="title" accessibilityRole="header">
          Seus Lembretes
        </ThemedText>

        <View style={styles.linhaContadorENovo}>
          <ThemedText
            type="subheading"
            themeColor="textSecondary"
            accessibilityLabel={`Contador: ${textoContador}`}>
            {textoContador}
          </ThemedText>

          <Botao
            rotulo="+ Novo"
            variante="primario"
            tamanho="compacto"
            onPress={handleNovo}
            accessibilityLabel="Criar novo lembrete"
            style={styles.botaoNovo}
          />
        </View>
      </View>

      {/* Lista de lembretes ou Estado Vazio Oficial */}
      {lembretes.length === 0 ? (
        <ListaVaziaLembretes onNovo={handleNovo} />
      ) : (
        <FlatList
          data={lembretes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listaConteudo}
          renderItem={({ item }) => (
            <ItemLembreteDeslizavel
              lembrete={item}
              tipo={item.tipoId ? mapaTipos.get(item.tipoId) : undefined}
              onAbrir={handleAbrir}
              onAlternarAtivo={alternarAtivo}
              onSolicitarExclusao={setLembreteParaExcluir}
            />
          )}
        />
      )}

      {/* Diálogo de confirmação protetiva para exclusão (WCAG 3.3.6) */}
      <DialogoConfirmacao
        visivel={lembreteParaExcluir !== null}
        titulo="Excluir lembrete?"
        mensagem={
          lembreteParaExcluir
            ? `"${lembreteParaExcluir.titulo}" e seus horários (${lembreteParaExcluir.horarios.join(', ')}) serão removidos.`
            : ''
        }
        rotuloConfirmar="Excluir"
        varianteConfirmar="perigo"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setLembreteParaExcluir(null)}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  cabecalho: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  linhaContadorENovo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  botaoNovo: {
    minHeight: TouchTarget,
    minWidth: 100,
  },
  listaConteudo: {
    paddingBottom: Spacing.four * 2,
    gap: Spacing.two,
  },
});

export default LembretesTabScreen;
