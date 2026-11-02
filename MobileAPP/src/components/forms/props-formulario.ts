import type { LayoutChangeEvent } from 'react-native';

import type { OpcaoTipo } from '@/components/formulario/selecao/seletor-tipo';
import type { FormularioLembrete } from '@/hooks/formulario/use-formulario-lembrete';
import type { DadosDoTemplate, TemplateId } from '@/types/lembrete';
import type { CampoComErro } from '@/utils/lembrete/validar-lembrete';

export type PropsFormulario<T extends TemplateId> = {
  form: FormularioLembrete<DadosDoTemplate<T>>;
  registrar: (campo: CampoComErro) => (evento: LayoutChangeEvent) => void;
  tipos: OpcaoTipo[];
};
