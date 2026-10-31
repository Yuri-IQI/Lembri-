import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AgendaVazia } from '@/components/agenda/agenda-vazia';
import { AvisoDesfazer } from '@/components/agenda/aviso-desfazer';
import { CabecalhoLista } from '@/components/agenda/cabecalho-lista';
import { FiltrosAgenda } from '@/components/agenda/filtros-agenda';
import { ListaAgenda } from '@/components/agenda/lista-agenda';
import { ProximoLembreteCard } from '@/components/cards/proximo-lembrete-card';
import { MainContainer } from '@/components/main-container';
import { Spacing } from '@/constants/theme';
import { useAgenda, type ChaveSecao } from '@/hooks/use-agenda';

const HomeScreen = () => {
  const [secaoAtiva, setSecaoAtiva] = useState<ChaveSecao>('proximas');
  const { lembretes, secoes, pausados, proxima, quandoProxima, feitos, acaoFeito } = useAgenda();
  const secao = secoes.find((item) => item.chave === secaoAtiva) ?? secoes[0];

  const cabecalho = (
    <View style={styles.cabecalho}>
      <ProximoLembreteCard
        ocorrencia={proxima}
        quando={quandoProxima}
        feito={proxima ? feitos.has(proxima.chave) : false}
        onAlternarFeito={acaoFeito(proxima ?? undefined)}
        onAbrir={(ocorrencia) =>
          router.push({ pathname: '/lembrete/[id]', params: { id: ocorrencia.lembrete.id } })
        }
      />
      <AvisoDesfazer />
      <CabecalhoLista programados={lembretes.length - pausados.length} pausados={pausados.length} />
      {lembretes.length > 0 && (
        <FiltrosAgenda ativa={secaoAtiva} pausados={pausados.length} onSelecionar={setSecaoAtiva} />
      )}
    </View>
  );

  if (lembretes.length === 0) {
    return (
      <MainContainer>
        {cabecalho}
        <AgendaVazia />
      </MainContainer>
    );
  }

  return (
    <MainContainer style={styles.container}>
      <ListaAgenda secao={secao} cabecalho={cabecalho} feitos={feitos} acaoFeito={acaoFeito} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  cabecalho: {
    gap: Spacing.three,
  },
});

export default HomeScreen;
