import { Botao } from '@/components/controles/botao';
import { CaixaDialogo } from '@/components/feedback/caixa-dialogo';
import { ChipsSelecao } from '@/components/formulario/selecao/chips-selecao';
import { templatesLembreteMock } from '@/mocks/templates-lembrete.mock';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { FILTROS_VAZIOS, type FiltrosLembrete } from '@/utils/lembrete/lembrete';

const OPCOES_TEMPLATE = templatesLembreteMock.map((template) => ({
  valor: template.id,
  rotulo: template.nome,
}));

type DialogoFiltrosProps = {
  visivel: boolean;
  tipos: TipoLembrete[];
  filtros: FiltrosLembrete;
  onAlterar: (filtros: FiltrosLembrete) => void;
  onFechar: () => void;
};

export const DialogoFiltros = ({
  visivel,
  tipos,
  filtros,
  onAlterar,
  onFechar,
}: DialogoFiltrosProps) => (
  <CaixaDialogo
    visivel={visivel}
    titulo="Filtros"
    rotuloConfirmar="Fechar"
    somenteConfirmar
    onConfirmar={onFechar}
    onCancelar={onFechar}>
    <ChipsSelecao
      rotulo="Tipo"
      multipla
      opcoes={tipos.map((tipo) => ({ valor: tipo.id, rotulo: tipo.nome }))}
      selecionados={filtros.tipoIds}
      onAlterar={(tipoIds) => onAlterar({ ...filtros, tipoIds })}
    />
    <ChipsSelecao
      rotulo="Modelo"
      multipla
      opcoes={OPCOES_TEMPLATE}
      selecionados={filtros.templates}
      onAlterar={(templates) => onAlterar({ ...filtros, templates })}
    />
    <Botao
      rotulo="Limpar filtros"
      variante="secundario"
      desabilitado={filtros.tipoIds.length + filtros.templates.length === 0}
      onPress={() => onAlterar(FILTROS_VAZIOS)}
    />
  </CaixaDialogo>
);
