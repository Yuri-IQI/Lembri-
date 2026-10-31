import { View } from 'react-native';

import type { PropsFormulario } from '@/components/forms/props-formulario';
import { CampoAutocompletar } from '@/components/formulario/campo-autocompletar';
import { CampoChecklist } from '@/components/formulario/campo-checklist';
import { CampoConfirmacao } from '@/components/formulario/campo-confirmacao';
import { CampoHorarios } from '@/components/formulario/campo-horarios';
import { CampoRepeticao } from '@/components/formulario/campo-repeticao';
import { SeletorTipo } from '@/components/formulario/seletor-tipo';
import { LIMITE_PASSOS, LIMITE_TEXTO_PASSO } from '@/utils/validar-lembrete';

/**
 * Formulário do template Tarefa da casa.
 */
export const FormularioTarefa = ({ form, registrar, tipos }: PropsFormulario<'tarefa'>) => {
  const { dados, alterar, erros } = form;

  return (
    <>
      <View onLayout={registrar('titulo')}>
        <CampoAutocompletar
          modo="unico"
          fonte="tarefas"
          rotulo="Título"
          obrigatorio
          placeholder="Ex.: Lavar roupa"
          valor={dados.titulo}
          onAlterar={(titulo) => alterar('titulo', titulo)}
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
        atalhoFimDeSemana
        erroDias={erros.dias}
        erroData={erros.dataRepeticao}
        onLayout={registrar('dias')}
      />
      <CampoAutocompletar
        modo="multiplo"
        fonte="materiais"
        rotulo="O que vou usar"
        placeholder="Ex.: Sabão em pó, balde"
        valores={dados.materiais}
        onAlterar={(materiais) => alterar('materiais', materiais)}
      />
      <CampoChecklist
        rotulo="Passos"
        itens={dados.passos}
        onAlterar={(passos) => alterar('passos', passos)}
        maximoItens={LIMITE_PASSOS}
        maximoCaracteres={LIMITE_TEXTO_PASSO}
        erro={erros.passos}
        onLayout={registrar('passos')}
      />
      <CampoConfirmacao
        ligado={dados.exigeConfirmacao}
        onAlterar={(ligado) => alterar('exigeConfirmacao', ligado)}
      />
    </>
  );
};
