import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BuscaTipo } from '@/components/formulario/busca-tipo';
import { CampoRotulado } from '@/components/formulario/campo-rotulado';
import { ChipTipo } from '@/components/formulario/chip-tipo';
import { DialogoNovoTipo } from '@/components/formulario/dialogo-novo-tipo';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { LIMITE_TIPOS } from '@/types/lembrete';

export type OpcaoTipo = { chave: string; nome: string; corHex: string };

type SeletorTipoProps = {
  opcoes: OpcaoTipo[];
  selecionados: string[];
  onAlterar: (chaves: string[]) => void;
};

/**
 * Tipos do lembrete (opcional, até LIMITE_TIPOS): os escolhidos aparecem como chips que saem
 * ao tocar; enquanto cabe mais um, há a busca com sugestões e o botão de criar tipo.
 */
export const SeletorTipo = ({ opcoes, selecionados, onAlterar }: SeletorTipoProps) => {
  const [nomeNovo, setNomeNovo] = useState<string | null>(null);
  const escolhidos = selecionados.flatMap((chave) => opcoes.find((o) => o.chave === chave) ?? []);
  const disponiveis = opcoes.filter((opcao) => !selecionados.includes(opcao.chave));
  const cheio = selecionados.length >= LIMITE_TIPOS;

  return (
    <CampoRotulado rotulo="Tipo">
      <ThemedText type="small" themeColor="textSecondary">
        {cheio
          ? `Já tem ${LIMITE_TIPOS} tipos. Tire um para escolher outro.`
          : `Escolha até ${LIMITE_TIPOS}.`}
      </ThemedText>
      {escolhidos.length > 0 && (
        <View style={styles.grade}>
          {escolhidos.map((opcao) => (
            <ChipTipo
              key={opcao.chave}
              nome={opcao.nome}
              corHex={opcao.corHex}
              onRemover={() => onAlterar(selecionados.filter((chave) => chave !== opcao.chave))}
            />
          ))}
        </View>
      )}
      {!cheio && (
        <BuscaTipo
          opcoes={disponiveis}
          onEscolher={(chave) => onAlterar([...selecionados, chave])}
          onCriar={setNomeNovo}
        />
      )}
      {nomeNovo !== null && (
        <DialogoNovoTipo
          visivel
          nomeInicial={nomeNovo}
          nomesExistentes={opcoes.map((opcao) => opcao.nome)}
          onFechar={() => setNomeNovo(null)}
          onCriado={(tipo) => onAlterar([...selecionados, tipo.id])}
        />
      )}
    </CampoRotulado>
  );
};

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
