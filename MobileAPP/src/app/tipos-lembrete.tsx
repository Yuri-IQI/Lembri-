import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { CriarTipo } from '@/components/tipos/criar-tipo';
import { ItemTipo } from '@/components/tipos/item-tipo';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSelecaoTiposStore } from '@/stores/useSelecaoTiposStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import { LIMITE_TIPOS } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { plural } from '@/utils/texto';

const semAcao = () => {};
const voltar = () => router.back();

/**
 * Tipos de Lembretes (CARD-34, Figma 152:1608): criar, excluir e, vindo do formulário, escolher
 * até LIMITE_TIPOS para o lembrete. Cada toque já chega ao formulário.
 */
const TiposLembreteScreen = () => {
  const theme = useTheme();
  const { tipos, removerTipo } = useTiposLembreteStore(
    useShallow((state) => ({ tipos: state.tipos, removerTipo: state.removerTipo }))
  );
  const lembretes = useLembretesStore((state) => state.lembretes);
  const contagem = (tipoId: string) =>
    lembretes.filter((lembrete) => lembrete.tipoIds.includes(tipoId)).length;
  const { selecionados, pendente, escolhendo, alternar, remover } = useSelecaoTiposStore(
    useShallow((state) => ({
      selecionados: state.selecionados,
      pendente: state.pendente,
      escolhendo: state.aoAlterar !== null,
      alternar: state.alternar,
      remover: state.remover,
    }))
  );
  const [aviso, setAviso] = useState<string | null>(null);
  const [paraExcluir, setParaExcluir] = useState<TipoLembrete | null>(null);

  const cheio = selecionados.length >= LIMITE_TIPOS;
  const acaoDe = (chave: string) =>
    escolhendo && (selecionados.includes(chave) || !cheio) ? () => alternar(chave) : undefined;

  const criado = (tipo: TipoLembrete) => {
    if (escolhendo && !cheio) alternar(tipo.id);
    setAviso(`Tipo "${tipo.nome}" criado.`);
  };

  const excluir = () => {
    if (!paraExcluir) return;
    removerTipo(paraExcluir.id);
    remover(paraExcluir.id);
    setAviso(`Tipo "${paraExcluir.nome}" excluído.`);
    setParaExcluir(null);
  };

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} onAjuda={semAcao} onAudio={semAcao} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            Tipos de Lembretes
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {escolhendo
              ? `Escolha até ${LIMITE_TIPOS} para o lembrete. ${selecionados.length} de ${LIMITE_TIPOS} escolhidos.`
              : 'Gerencie seus tipos de lembretes'}
          </ThemedText>
        </View>

        <AvisoSucesso mensagem={aviso} onFechar={() => setAviso(null)} />

        <CriarTipo
          nomesExistentes={[
            ...tipos.map((tipo) => tipo.nome),
            ...(pendente ? [pendente.nome] : []),
          ]}
          onCriado={criado}
        />

        <View style={styles.secao}>
          <ThemedText type="label" themeColor="textSecondary" accessibilityRole="header">
            MEUS TIPOS
          </ThemedText>
          <Card style={[styles.lista, { borderColor: theme.border }]}>
            {pendente && (
              <ItemTipo
                nome={pendente.nome}
                corHex={pendente.corHex}
                detalhe="Sugerido pelo modelo. É criado ao salvar."
                selecionado={selecionados.includes(pendente.chave)}
                onAlternar={acaoDe(pendente.chave)}
              />
            )}
            {tipos.map((tipo) => (
              <ItemTipo
                key={tipo.id}
                nome={tipo.nome}
                corHex={tipo.corHex}
                detalhe={plural(contagem(tipo.id), 'lembrete', 'lembretes')}
                selecionado={selecionados.includes(tipo.id)}
                onAlternar={acaoDe(tipo.id)}
                onExcluir={() => setParaExcluir(tipo)}
              />
            ))}
          </Card>
        </View>

        {escolhendo && <Botao rotulo="Pronto" icone="check" onPress={voltar} />}
      </ScrollView>

      <DialogoConfirmacao
        visivel={paraExcluir !== null}
        titulo="Excluir tipo?"
        mensagem={
          paraExcluir
            ? `Excluir o tipo "${paraExcluir.nome}"? Os lembretes não são apagados, só ficam sem esse tipo.`
            : ''
        }
        rotuloConfirmar="Excluir"
        varianteConfirmar="perigo"
        onConfirmar={excluir}
        onCancelar={() => setParaExcluir(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  cabecalho: {
    gap: Spacing.one,
  },
  secao: {
    gap: Spacing.two,
  },
  lista: {
    padding: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
});

export default TiposLembreteScreen;
