import { useShallow } from 'zustand/react/shallow';

import type { OpcaoTipo } from '@/components/formulario/selecao/seletor-tipo';
import { obterTemplate } from '@/mocks/templates-lembrete.mock';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { TemplateId } from '@/types/lembrete';
import { normalizarBusca } from '@/utils/texto/texto';

export const CHAVE_TIPO_PADRAO = 'tipo-padrao-pendente';

export const useOpcoesTipo = (template: TemplateId) => {
  const { tipos, garantirTipo } = useTiposLembreteStore(
    useShallow((state) => ({ tipos: state.tipos, garantirTipo: state.garantirTipo }))
  );
  const padrao = obterTemplate(template).tipoPadrao;
  const existente = padrao
    ? tipos.find((tipo) => normalizarBusca(tipo.nome) === normalizarBusca(padrao.nome))
    : undefined;

  const opcoes: OpcaoTipo[] = [
    ...tipos.map((tipo) => ({ chave: tipo.id, nome: tipo.nome, corHex: tipo.corHex })),
    ...(padrao && !existente ? [{ chave: CHAVE_TIPO_PADRAO, ...padrao }] : []),
  ];

  return {
    opcoes,
    tiposIniciais: existente ? [existente.id] : padrao ? [CHAVE_TIPO_PADRAO] : [],
    resolverTipos: (chaves: string[]) =>
      chaves.map((chave) =>
        chave === CHAVE_TIPO_PADRAO && padrao ? garantirTipo(padrao).id : chave
      ),
  };
};
