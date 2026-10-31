import { router } from 'expo-router';
import { useMemo, type ReactElement } from 'react';
import { SectionList, StyleSheet } from 'react-native';

import { ArrastarParaRemover } from '@/components/agenda/arrastar-para-remover';
import { GrupoAgendaCard, type HorarioDoCard } from '@/components/cards/grupo-agenda-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { SecaoAgenda } from '@/hooks/use-agenda';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { OcorrenciaLembrete } from '@/types/lembrete';
import type { GrupoAgenda } from '@/utils/agrupar-agenda';

type ListaAgendaProps = {
  secao: SecaoAgenda;
  cabecalho: ReactElement;
  agora: Date;
  feitos: Set<string>;
  acaoFeito: (ocorrencia?: OcorrenciaLembrete) => (() => void) | undefined;
  todoFeito: (grupo: GrupoAgenda) => boolean;
  onOcultar: (chave: string) => void;
};

const abrirDetalhe = (grupo: GrupoAgenda) =>
  router.push({ pathname: '/lembrete/[id]', params: { id: grupo.lembrete.id } });

export const ListaAgenda = ({
  secao,
  cabecalho,
  agora,
  feitos,
  acaoFeito,
  todoFeito,
  onOcultar,
}: ListaAgendaProps) => {
  const tipos = useTiposLembreteStore((state) => state.tipos);
  const mapaTipos = useMemo(() => new Map(tipos.map((tipo) => [tipo.id, tipo])), [tipos]);

  const tiposDo = (grupo: GrupoAgenda) =>
    grupo.lembrete.tipoIds.flatMap((id) => mapaTipos.get(id) ?? []);

  const horariosDo = (grupo: GrupoAgenda): HorarioDoCard[] =>
    grupo.ocorrencias.map((ocorrencia) => ({
      chave: ocorrencia.chave,
      horario: ocorrencia.horario,
      estado: feitos.has(ocorrencia.chave)
        ? 'feito'
        : ocorrencia.quando < agora
          ? 'nao_marcado'
          : 'pendente',
      onAlternar: acaoFeito(ocorrencia),
    }));

  const renderizar = (grupo: GrupoAgenda) => {
    const removivel = secao.chave === 'proximas' && todoFeito(grupo);
    const card = (
      <GrupoAgendaCard
        lembrete={grupo.lembrete}
        tipos={tiposDo(grupo)}
        horarios={horariosDo(grupo)}
        onAbrir={() => abrirDetalhe(grupo)}
        onRemover={removivel ? () => onOcultar(grupo.chave) : undefined}
      />
    );
    return removivel ? (
      <ArrastarParaRemover chave={grupo.chave} onRemover={onOcultar}>
        {card}
      </ArrastarParaRemover>
    ) : (
      card
    );
  };

  return (
    <SectionList
      sections={secao.dias}
      keyExtractor={(grupo) => grupo.chave}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={
        <ThemedText type="small" themeColor="textSecondary" style={styles.titulo}>
          {secao.vazio}
        </ThemedText>
      }
      contentContainerStyle={styles.lista}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <ThemedText type="headline" accessibilityRole="header" style={styles.titulo}>
          {section.titulo}
        </ThemedText>
      )}
      renderItem={({ item }) => renderizar(item)}
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
