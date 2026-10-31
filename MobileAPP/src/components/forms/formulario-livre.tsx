import { View } from 'react-native';

import type { PropsFormulario } from '@/components/forms/props-formulario';
import { CampoConfirmacao } from '@/components/formulario/campo-confirmacao';
import { CampoHorarios } from '@/components/formulario/campo-horarios';
import { CampoRepeticao } from '@/components/formulario/campo-repeticao';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorTipo } from '@/components/formulario/seletor-tipo';

/**
 * Formulário do template Livre (frame `criar lembrete` do Figma).
 */
export const FormularioLivre = ({ form, registrar, tipos }: PropsFormulario<'livre'>) => {
  const { dados, alterar, erros } = form;

  return (
    <>
      <View onLayout={registrar('titulo')}>
        <CampoTexto
          rotulo="Título"
          obrigatorio
          valor={dados.titulo}
          onAlterar={(titulo) => alterar('titulo', titulo)}
          placeholder="Ex.: Jantar"
          erro={erros.titulo}
        />
      </View>
      <SeletorTipo
        opcoes={tipos}
        selecionados={dados.tipoIds}
        onAlterar={(tipoIds) => alterar('tipoIds', tipoIds)}
      />
      <CampoHorarios
        horarios={dados.horarios}
        onAlterar={(horarios) => alterar('horarios', horarios)}
        erro={erros.horarios}
        onLayout={registrar('horarios')}
      />
      <CampoRepeticao
        valor={dados.repeticao}
        onAlterar={(repeticao) => alterar('repeticao', repeticao)}
        erroDias={erros.dias}
        erroData={erros.dataRepeticao}
        onLayout={registrar('dias')}
      />
      <CampoConfirmacao
        ligado={dados.exigeConfirmacao}
        onAlterar={(ligado) => alterar('exigeConfirmacao', ligado)}
      />
      <CampoTexto
        rotulo="Descrição"
        valor={dados.descricao ?? ''}
        onAlterar={(texto) => alterar('descricao', texto)}
        placeholder="Ex.: Esquentar a comida da geladeira"
        multiline
      />
    </>
  );
};
