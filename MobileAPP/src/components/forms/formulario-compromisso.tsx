import { View } from 'react-native';

import type { PropsFormulario } from '@/components/forms/props-formulario';
import { CampoAutocompletar } from '@/components/formulario/campo-autocompletar';
import { CampoConfirmacao } from '@/components/formulario/campo-confirmacao';
import { CampoData } from '@/components/formulario/campo-data';
import { CampoHorarios } from '@/components/formulario/campo-horarios';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { ChipsSelecao } from '@/components/formulario/chips-selecao';
import { SeletorTipo } from '@/components/formulario/seletor-tipo';
import type { AvisoAntes } from '@/types/lembrete';
import { NOMES_AVISO_ANTES } from '@/utils/detalhes-lembrete';
import { LIMITE_OBSERVACAO } from '@/utils/validar-lembrete';

const AVISOS = (Object.keys(NOMES_AVISO_ANTES) as AvisoAntes[]).map((valor) => ({
  valor,
  rotulo: NOMES_AVISO_ANTES[valor],
}));

/**
 * Formulário do template Compromisso: acontece uma vez, numa data e horário.
 */
export const FormularioCompromisso = ({
  form,
  registrar,
  tipos,
}: PropsFormulario<'compromisso'>) => {
  const { dados, alterar, erros } = form;

  return (
    <>
      <View onLayout={registrar('titulo')}>
        <CampoAutocompletar
          modo="unico"
          fonte="compromissos"
          rotulo="Título"
          obrigatorio
          placeholder="Ex.: Consulta no cardiologista"
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
        unico
        horarios={dados.horario ? [dados.horario] : []}
        onAlterar={([horario]) => alterar('horario', horario ?? '')}
        erro={erros.horario}
        onLayout={registrar('horario')}
      />
      <CampoData
        rotulo="Data"
        obrigatorio
        valor={dados.data}
        onAlterar={(data) => alterar('data', data)}
        minimo={new Date()}
        erro={erros.data}
        onLayout={registrar('data')}
      />
      <ChipsSelecao
        rotulo="Avisar antes"
        multipla
        opcoes={AVISOS}
        selecionados={dados.avisarAntes}
        onAlterar={(avisos) => alterar('avisarAntes', avisos)}
      />
      <CampoAutocompletar
        modo="multiplo"
        fonte="participantes"
        rotulo="Participantes"
        placeholder="Ex.: Ana, Dr. Paulo"
        valores={dados.participantes}
        onAlterar={(participantes) => alterar('participantes', participantes)}
      />
      <CampoAutocompletar
        modo="unico"
        fonte="locais"
        rotulo="Local"
        placeholder="Ex.: Clínica São José"
        valor={dados.local ?? ''}
        onAlterar={(local) => alterar('local', local)}
      />
      <CampoAutocompletar
        modo="multiplo"
        fonte="itensLevar"
        rotulo="O que levar"
        placeholder="Ex.: Exames anteriores"
        valores={dados.oQueLevar}
        onAlterar={(itens) => alterar('oQueLevar', itens)}
      />
      <CampoConfirmacao
        ligado={dados.exigeConfirmacao}
        onAlterar={(ligado) => alterar('exigeConfirmacao', ligado)}
      />
      <View onLayout={registrar('observacao')}>
        <CampoTexto
          rotulo="Observação"
          valor={dados.observacao ?? ''}
          onAlterar={(texto) => alterar('observacao', texto)}
          placeholder="Ex.: Chegar 15 minutos antes"
          multiline
          maxLength={LIMITE_OBSERVACAO}
          erro={erros.observacao}
        />
      </View>
    </>
  );
};
