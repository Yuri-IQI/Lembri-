import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { AvisoDesfazer } from '@/components/agenda/aviso-desfazer';
import { CabecalhoLista } from '@/components/agenda/cabecalho-lista';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { BuscaSemResultado } from '@/components/lembrete/busca-sem-resultado';
import { CampoBusca } from '@/components/lembrete/campo-busca';
import { ItemLembrete } from '@/components/lembrete/item-lembrete';
import { ListaVaziaLembretes } from '@/components/lembrete/lista-vazia-lembretes';
import { MainContainer } from '@/components/main-container';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { Lembrete } from '@/types/lembrete';
import { filtrarLembretes, horariosDoLembrete } from '@/utils/lembrete';

/**
 * Aba Lembretes (CARD-31, Figma 152:1440 e 152:1538): todos os lembretes, inclusive pausados,
 * com busca pelo nome, o contador de ativos, o switch de alertas e deslizar para excluir.
 */
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
  const encontrados = useMemo(() => filtrarLembretes(lembretes, busca), [lembretes, busca]);

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
              <CampoBusca valor={busca} aoMudar={setBusca} aoLimpar={() => setBusca('')} />
            )}
          </View>
        }
        ListEmptyComponent={
          lembretes.length > 0 ? (
            <BuscaSemResultado busca={busca} onLimpar={() => setBusca('')} />
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
});

export default LembretesScreen;
