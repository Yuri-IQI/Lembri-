import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { TelaFormulario } from '@/components/forms/tela-formulario';
import { useOpcoesTipo } from '@/hooks/formulario/use-opcoes-tipo';
import { obterTemplate, templatesLembreteMock } from '@/mocks/templates-lembrete.mock';
import type { TemplateId } from '@/types/lembrete';
import { dadosIniciais } from '@/utils/dados/dados-iniciais';

const ehTemplate = (valor?: string): valor is TemplateId =>
  templatesLembreteMock.some((template) => template.id === valor);

type TextosPadrao = {
  titulo?: string;
  descricao?: string;
};

const FormularioNovo = ({
  template,
  titulo,
  descricao,
}: TextosPadrao & { template: TemplateId }) => {
  const { tiposIniciais } = useOpcoesTipo(template);
  const [inicial] = useState(() => {
    const dados = dadosIniciais(template, tiposIniciais, new Date());
    if (dados.template !== 'livre') return dados;
    return { ...dados, titulo: titulo ?? dados.titulo, descricao };
  });

  return <TelaFormulario titulo={obterTemplate(template).tituloNovo} inicial={inicial} />;
};

const NovoDoTemplateScreen = () => {
  const { template, titulo, descricao } = useLocalSearchParams<
    TextosPadrao & { template: string }
  >();
  if (!ehTemplate(template)) return <Redirect href="/lembrete/novo" />;
  return <FormularioNovo template={template} titulo={titulo} descricao={descricao} />;
};

export default NovoDoTemplateScreen;
