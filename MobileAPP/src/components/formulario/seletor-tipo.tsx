import { router } from 'expo-router';

import { Botao } from '@/components/botao';
import { CampoRotulado } from '@/components/formulario/campo-rotulado';
import { ListaEtiquetas } from '@/components/lista-etiquetas';
import { ThemedText } from '@/components/themed-text';
import { CHAVE_TIPO_PADRAO } from '@/hooks/formulario/use-opcoes-tipo';
import { useSelecaoTiposStore } from '@/stores/useSelecaoTiposStore';
import { LIMITE_TIPOS } from '@/types/lembrete';

export type OpcaoTipo = { chave: string; nome: string; corHex: string };

type SeletorTipoProps = {
  opcoes: OpcaoTipo[];
  selecionados: string[];
  onAlterar: (chaves: string[]) => void;
};

/**
 * Tipos do lembrete (opcional, até LIMITE_TIPOS): mostra as etiquetas escolhidas e leva à tela
 * de tipos, onde se escolhe, cria e exclui.
 */
export const SeletorTipo = ({ opcoes, selecionados, onAlterar }: SeletorTipoProps) => {
  const iniciar = useSelecaoTiposStore((state) => state.iniciar);
  const escolhidos = selecionados.flatMap((chave) => {
    const opcao = opcoes.find((item) => item.chave === chave);
    return opcao ? [{ id: opcao.chave, nome: opcao.nome, corHex: opcao.corHex }] : [];
  });

  const escolher = () => {
    const pendente = opcoes.find((opcao) => opcao.chave === CHAVE_TIPO_PADRAO) ?? null;
    iniciar(selecionados, pendente, onAlterar);
    router.push('/tipos-lembrete');
  };

  return (
    <CampoRotulado rotulo="Tipo">
      <ThemedText type="small" themeColor="textSecondary">
        {escolhidos.length > 0
          ? `${escolhidos.length} de ${LIMITE_TIPOS} escolhidos.`
          : `Nenhum tipo. Escolha até ${LIMITE_TIPOS}.`}
      </ThemedText>
      <ListaEtiquetas tipos={escolhidos} />
      <Botao
        rotulo="Escolher tipos"
        icone="sell"
        variante="secundario"
        onPress={escolher}
        accessibilityLabel="Escolher os tipos do lembrete"
      />
    </CampoRotulado>
  );
};
