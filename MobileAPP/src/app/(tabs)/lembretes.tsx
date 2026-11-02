import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { AvisoDesfazer } from '@/components/agenda/aviso-desfazer';
import { CabecalhoLista } from '@/components/agenda/cabecalho-lista';
import { Botao } from '@/components/controles/botao';
import { DialogoConfirmacao } from '@/components/feedback/dialogo-confirmacao';
import { BuscaSemResultado } from '@/components/lembrete/lista/busca-sem-resultado';
import { CampoBusca } from '@/components/lembrete/lista/campo-busca';
import { DialogoFiltros } from '@/components/lembrete/lista/dialogo-filtros';
import { ItemLembrete } from '@/components/lembrete/lista/item-lembrete';
import { ListaVaziaLembretes } from '@/components/lembrete/lista/lista-vazia-lembretes';
import { MainContainer } from '@/components/main-container';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { Lembrete } from '@/types/lembrete';
import { FILTROS_VAZIOS, filtrarLembretes, horariosDoLembrete } from '@/utils/lembrete/lembrete';

const LembretesScreen = () => {
  const { lembretes, alternarAtivo, removerLembrete } = useLembretesStore(
    useShallow((state) => ({
      lembretes: state.lembretes,
      alternarAtivo: state.alternarAtivo,
      removerLembrete: state.removerLembrete,
    }))
  );
  const tipos = useTiposLembreteStore((state) => state.tipos);
  const mapaTipos = useMemo(() => new Map(tipos.map((tipo) => [tipo.id, tipo])), [tipos]);
  const [paraExcluir, setParaExcluir] = useState<Lembrete | null>(null);
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [filtrando, setFiltrando] = useState(false);
  const filtrosValidos = useMemo(
    () => ({ ...filtros, tipoIds: filtros.tipoIds.filter((id) => mapaTipos.has(id)) }),
    [filtros, mapaTipos]
  );
  const totalFiltros = filtrosValidos.tipoIds.length + filtrosValidos.templates.length;
  const encontrados = useMemo(
    () => filtrarLembretes(lembretes, busca, filtrosValidos),
    [lembretes, busca, filtrosValidos]
  );
  const limparBuscaEFiltros = () => {
    setBusca('');
    setFiltros(FILTROS_VAZIOS);
  };

  const ativos = lembretes.filter((lembrete) => lembrete.ativo).length;
  const pedirExclusao = (id: string) =>
    setParaExcluir(lembretes.find((lembrete) => lembrete.id === id) ?? null);

  const excluir = () => {
    if (paraExcluir) removerLembrete(paraExcluir.id);
    setParaExcluir(null);
  };

  return (
    <MainContainer style={styles.container}>
      <FlatList
        data={encontrados}
        keyExtractor={(lembrete) => lembrete.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <AvisoDesfazer />
            <CabecalhoLista resumo={`${ativos} de ${lembretes.length} ativos`} />
            {lembretes.length > 0 && (
              <View style={styles.areaBusca}>
                <View style={styles.campoBusca}>
                  <CampoBusca valor={busca} aoMudar={setBusca} aoLimpar={() => setBusca('')} />
                </View>
                <Botao
                  rotulo={totalFiltros > 0 ? `Filtros (${totalFiltros})` : 'Filtros'}
                  variante="secundario"
                  tamanho="compacto"
                  icone="filter_list"
                  accessibilityLabel={
                    totalFiltros > 0
                      ? `Abrir filtros, ${totalFiltros} selecionados`
                      : 'Abrir filtros por tipo e modelo'
                  }
                  onPress={() => setFiltrando(true)}
                />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          lembretes.length > 0 ? (
            <BuscaSemResultado
              busca={busca}
              comFiltros={totalFiltros > 0}
              onLimpar={limparBuscaEFiltros}
            />
          ) : (
            <ListaVaziaLembretes onNovo={() => router.push('/lembrete/novo')} />
          )
        }
        renderItem={({ item }) => (
          <ItemLembrete
            lembrete={item}
            tipos={item.tipoIds.flatMap((id) => mapaTipos.get(id) ?? [])}
            onAlternarAtivo={alternarAtivo}
            onExcluir={pedirExclusao}
          />
        )}
      />

      <DialogoConfirmacao
        visivel={paraExcluir !== null}
        titulo="Excluir lembrete?"
        mensagem={
          paraExcluir
            ? `"${paraExcluir.titulo}" e seus horários (${horariosDoLembrete(paraExcluir).join(', ')}) serão removidos.`
            : ''
        }
        rotuloConfirmar="Excluir"
        varianteConfirmar="perigo"
        onConfirmar={excluir}
        onCancelar={() => setParaExcluir(null)}
      />

      <DialogoFiltros
        visivel={filtrando}
        tipos={tipos}
        filtros={filtrosValidos}
        onAlterar={setFiltros}
        onFechar={() => setFiltrando(false)}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  lista: {
    flexGrow: 1,
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  cabecalho: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  areaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  campoBusca: {
    flex: 1,
  },
});

export default LembretesScreen;
