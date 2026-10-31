import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { TelaFormulario } from '@/components/forms/tela-formulario';
import { useOpcoesTipo } from '@/hooks/formulario/use-opcoes-tipo';
import { obterTemplate, templatesLembreteMock } from '@/mocks/templates-lembrete.mock';
import type { TemplateId } from '@/types/lembrete';
import { dadosIniciais } from '@/utils/dados-iniciais';

const ehTemplate = (valor?: string): valor is TemplateId =>
  templatesLembreteMock.some((template) => template.id === valor);

const FormularioNovo = ({ template }: { template: TemplateId }) => {
  const { tiposIniciais } = useOpcoesTipo(template);
  const [inicial] = useState(() => dadosIniciais(template, tiposIniciais, new Date()));

  return <TelaFormulario titulo={obterTemplate(template).tituloNovo} inicial={inicial} />;
};

const NovoDoTemplateScreen = () => {
  const { template } = useLocalSearchParams<{ template: string }>();
  if (!ehTemplate(template)) return <Redirect href="/lembrete/novo" />;
  return <FormularioNovo template={template} />;
};

export default NovoDoTemplateScreen;
