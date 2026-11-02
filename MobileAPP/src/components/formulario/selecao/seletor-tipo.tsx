import { router } from 'expo-router';

import { Botao } from '@/components/controles/botao';
import { CampoRotulado } from '@/components/formulario/base/campo-rotulado';
import { ListaEtiquetas } from '@/components/etiquetas/lista-etiquetas';
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
