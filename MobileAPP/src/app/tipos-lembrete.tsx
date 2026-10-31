import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorCor } from '@/components/formulario/seletor-cor';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import {
  BorderWidth,
  PaletaTipos,
  Radius,
  Spacing,
  TouchTarget,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { TipoLembrete } from '@/types/tipo-lembrete';

const semAcao = () => {};
const voltar = () => router.back();

/**
 * Gerenciador de Categorias / Tipos de Lembretes (CARD-34 - Figma 152:1608).
 *
 * Características WCAG 2.2 AAA:
 * - Seletor de cores acessível com contraste garantido >= 7:1;
 * - Prevenção de erros na exclusão de categoria (RN-07: desassocia lembretes sem apagá-los);
 * - Alvos de toque TouchTarget = 56dp no botão de exclusão e formulário.
 */
const TiposLembreteScreen = () => {
  const theme = useTheme();
  const tipos = useTiposLembreteStore((state) => state.tipos);
  const adicionarTipo = useTiposLembreteStore((state) => state.adicionarTipo);
  const removerTipo = useTiposLembreteStore((state) => state.removerTipo);
  const obterContagemPorTipo = useLembretesStore((state) => state.obterContagemPorTipo);

  const [nome, setNome] = useState('');
  const [corHex, setCorHex] = useState<string>(PaletaTipos[0].corHex);
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [tipoParaExcluir, setTipoParaExcluir] = useState<TipoLembrete | null>(null);

  const handleAdicionar = () => {
    if (!nome.trim()) {
      setErroNome('Informe o nome da categoria.');
      return;
    }

    adicionarTipo({
      nome: nome.trim(),
      corHex,
    });

    setSucesso(`Categoria "${nome.trim()}" adicionada com sucesso!`);
    setNome('');
    setErroNome(null);
  };

  const handleConfirmarExclusao = () => {
    if (tipoParaExcluir) {
      removerTipo(tipoParaExcluir.id);
      setSucesso(`Categoria "${tipoParaExcluir.nome}" excluída.`);
      setTipoParaExcluir(null);
    }
  };

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={voltar} onAjuda={semAcao} onAudio={semAcao} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <ThemedText type="title" accessibilityRole="header">
            Tipos de Lembretes
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Gerencie seus tipos de lembretes
          </ThemedText>
        </View>

        {sucesso && (
          <AvisoSucesso mensagem={sucesso} onFechar={() => setSucesso(null)} />
        )}

        {/* Card Criar Tipo */}
        <Card style={[styles.cardCriar, { borderColor: theme.border }]}>
          <ThemedText type="subheading">Criar Tipo</ThemedText>

          <CampoTexto
            rotulo="Nome da categoria"
            placeholder="Ex.: Saúde, Casa, Estudos"
            valor={nome}
            onAlterar={(txt) => {
              setNome(txt);
              if (erroNome) setErroNome(null);
            }}
            erro={erroNome ?? undefined}
          />

          <SeletorCor
            rotulo="Cor:"
            valor={corHex}
            onAlterar={setCorHex}
          />

          <Botao
            rotulo="Adicionar"
            variante="primario"
            onPress={handleAdicionar}
            accessibilityLabel="Adicionar nova categoria"
            style={styles.botaoAdicionar}
          />
        </Card>

        {/* Seção MEUS TIPOS */}
        <View style={styles.secaoMeusTipos}>
          <ThemedText type="label" themeColor="textSecondary">
            MEUS TIPOS
          </ThemedText>

          <Card style={[styles.cardLista, { borderColor: theme.border }]}>
            {tipos.map((item, index) => {
              const contagem = obterContagemPorTipo(item.id);
              const textoContagem =
                contagem === 1 ? '1 lembrete' : `${contagem} lembretes`;

              return (
                <View key={item.id}>
                  {index > 0 && (
                    <View
                      style={[styles.divisor, { borderColor: theme.borderSubtle }]}
                    />
                  )}
                  <View style={styles.itemTipo}>
                    <View style={styles.infoTipo}>
                      <View
                        style={[
                          styles.bolinhaCor,
                          { backgroundColor: item.corHex },
                        ]}
                      />
                      <View style={styles.textosTipo}>
                        <ThemedText type="defaultBold">{item.nome}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {textoContagem}
                        </ThemedText>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => setTipoParaExcluir(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Excluir categoria ${item.nome}`}
                      accessibilityHint="Abre diálogo de confirmação. Lembretes associados não serão apagados."
                      style={({ pressed }) => [
                        styles.botaoLixeira,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}>
                      <SymbolView
                        name={{ android: 'delete_outline' }}
                        size={24}
                        tintColor={theme.danger}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>

      {/* Diálogo de confirmação de exclusão da categoria (RN-07 / RN-04) */}
      <DialogoConfirmacao
        visivel={tipoParaExcluir !== null}
        titulo="Excluir categoria?"
        mensagem={
          tipoParaExcluir
            ? `Excluir o tipo "${tipoParaExcluir.nome}"? Os lembretes associados não serão apagados, apenas ficarão sem categoria vinculada.`
            : ''
        }
        rotuloConfirmar="Excluir"
        varianteConfirmar="perigo"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={() => setTipoParaExcluir(null)}
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
    paddingBottom: Spacing.four * 2,
  },
  cabecalho: {
    gap: Spacing.one,
  },
  cardCriar: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  botaoAdicionar: {
    minHeight: TouchTarget,
    marginTop: Spacing.one,
  },
  secaoMeusTipos: {
    gap: Spacing.two,
  },
  cardLista: {
    padding: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  itemTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    minHeight: TouchTarget,
  },
  infoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  bolinhaCor: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
  },
  textosTipo: {
    gap: 2,
    flex: 1,
  },
  botaoLixeira: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divisor: {
    borderBottomWidth: 1,
    marginHorizontal: Spacing.one,
  },
});

export default TiposLembreteScreen;
