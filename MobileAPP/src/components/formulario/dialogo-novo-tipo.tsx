import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CaixaDialogo } from '@/components/caixa-dialogo';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorCor } from '@/components/formulario/seletor-cor';
import { PaletaTipos, Spacing } from '@/constants/theme';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { normalizarBusca } from '@/utils/texto';

type DialogoNovoTipoProps = {
  visivel: boolean;
  /** Texto já digitado na busca; o diálogo é montado de novo a cada abertura. */
  nomeInicial?: string;
  /** Nomes já usados (inclui o tipo padrão do template que ainda não foi criado). */
  nomesExistentes: string[];
  onFechar: () => void;
  onCriado: (tipo: TipoLembrete) => void;
};

const COR_INICIAL = PaletaTipos[0].corHex;

/**
 * Cadastro rápido de um tipo de lembrete: nome e cor.
 */
export const DialogoNovoTipo = ({
  visivel,
  nomeInicial = '',
  nomesExistentes,
  onFechar,
  onCriado,
}: DialogoNovoTipoProps) => {
  const adicionarTipo = useTiposLembreteStore((state) => state.adicionarTipo);
  const [nome, setNome] = useState(nomeInicial);
  const [cor, setCor] = useState<string>(COR_INICIAL);
  const [erro, setErro] = useState<string>();

  const criar = () => {
    const limpo = nome.trim();
    if (!limpo) return setErro('Escreva o nome do tipo.');
    if (nomesExistentes.some((item) => normalizarBusca(item) === normalizarBusca(limpo))) {
      return setErro('Já existe um tipo com esse nome.');
    }
    onCriado(adicionarTipo({ nome: limpo, corHex: cor }));
    onFechar();
  };

  return (
    <CaixaDialogo
      visivel={visivel}
      titulo="Novo tipo"
      rotuloConfirmar="Criar"
      descricaoCancelar="Cancelar sem criar o tipo"
      onConfirmar={criar}
      onCancelar={onFechar}>
      <View style={styles.campos}>
        <CampoTexto
          rotulo="Nome"
          obrigatorio
          valor={nome}
          onAlterar={(texto) => {
            setNome(texto);
            setErro(undefined);
          }}
          placeholder="Ex.: Família"
          maxLength={24}
          erro={erro}
        />
        <SeletorCor rotulo="Cor" valor={cor} onAlterar={setCor} />
      </View>
    </CaixaDialogo>
  );
};

const styles = StyleSheet.create({
  campos: {
    gap: Spacing.three,
  },
});
