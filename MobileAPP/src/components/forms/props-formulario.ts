import type { LayoutChangeEvent } from 'react-native';

import type { OpcaoTipo } from '@/components/formulario/seletor-tipo';
import type { FormularioLembrete } from '@/hooks/formulario/use-formulario-lembrete';
import type { DadosDoTemplate, TemplateId } from '@/types/lembrete';
import type { CampoComErro } from '@/utils/validar-lembrete';

/** Props comuns aos formulários de template. */
export type PropsFormulario<T extends TemplateId> = {
  form: FormularioLembrete<DadosDoTemplate<T>>;
  registrar: (campo: CampoComErro) => (evento: LayoutChangeEvent) => void;
  tipos: OpcaoTipo[];
};
