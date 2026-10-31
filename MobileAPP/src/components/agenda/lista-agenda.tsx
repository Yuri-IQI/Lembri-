import { router } from 'expo-router';
import { useMemo, type ReactElement } from 'react';
import { SectionList, StyleSheet } from 'react-native';

import { OcorrenciaItem } from '@/components/cards/ocorrencia-item';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ItemAgenda, SecaoAgenda } from '@/hooks/use-agenda';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { OcorrenciaLembrete } from '@/types/lembrete';
import { capitalizar } from '@/utils/texto';

type ListaAgendaProps = {
  secao: SecaoAgenda;
  cabecalho: ReactElement;
  feitos: Set<string>;
  acaoFeito: (ocorrencia?: OcorrenciaLembrete) => (() => void) | undefined;
};

const abrirDetalhe = (item: ItemAgenda) =>
  router.push({ pathname: '/lembrete/[id]', params: { id: item.lembrete.id } });

export const ListaAgenda = ({ secao, cabecalho, feitos, acaoFeito }: ListaAgendaProps) => {
  const tipos = useTiposLembreteStore((state) => state.tipos);
  const mapaTipos = useMemo(() => new Map(tipos.map((tipo) => [tipo.id, tipo])), [tipos]);

  return (
    <SectionList
      sections={[secao]}
      keyExtractor={(item) => item.chave}
      ListHeaderComponent={cabecalho}
      contentContainerStyle={styles.lista}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <ThemedText type="headline" accessibilityRole="header" style={styles.titulo}>
          {capitalizar(section.titulo)}
        </ThemedText>
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            {section.vazio}
          </ThemedText>
        ) : null
      }
      renderItem={({ item }) => (
        <OcorrenciaItem
          lembrete={item.lembrete}
          tipo={item.lembrete.tipoId ? mapaTipos.get(item.lembrete.tipoId) : undefined}
          horario={item.ocorrencia?.horario}
          rotuloDia={item.rotuloDia}
          feito={feitos.has(item.chave)}
          onAlternarFeito={acaoFeito(item.ocorrencia)}
          onAbrir={() => abrirDetalhe(item)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  lista: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  titulo: {
    marginTop: Spacing.two,
  },
});
