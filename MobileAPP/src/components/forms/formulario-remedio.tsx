import { View } from 'react-native';

import type { PropsFormulario } from '@/components/forms/props-formulario';
import { Calendario } from '@/components/formulario/calendario';
import { CampoAutocompletar } from '@/components/formulario/campo-autocompletar';
import { CampoHorarios } from '@/components/formulario/campo-horarios';
import { CampoQuantidade } from '@/components/formulario/campo-quantidade';
import { CampoRepeticao } from '@/components/formulario/campo-repeticao';
import { CampoRotulado } from '@/components/formulario/campo-rotulado';
import { CampoSelecao } from '@/components/formulario/campo-selecao';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorTipo } from '@/components/formulario/seletor-tipo';
import type { MinutosReaviso } from '@/types/lembrete';
import { LIMITE_OBSERVACAO } from '@/utils/validar-lembrete';

const REAVISOS = ([5, 10, 15] as MinutosReaviso[]).map((minutos) => ({
  valor: minutos,
  rotulo: `${minutos} minutos depois`,
}));

/**
 * Formulário do template Remédio. Não tem "Exige confirmação": remédio sempre exige.
 */
export const FormularioRemedio = ({ form, registrar, tipos }: PropsFormulario<'remedio'>) => {
  const { dados, alterar, erros } = form;

  return (
    <>
      <View onLayout={registrar('titulo')}>
        <CampoAutocompletar
          modo="unico"
          fonte="remedios"
          rotulo="Nome do remédio"
          obrigatorio
          placeholder="Ex.: Losartana"
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
      <CampoQuantidade
        quantidade={dados.quantidade}
        onAlterar={(quantidade) => alterar('quantidade', quantidade)}
        erro={erros.quantidade}
        onLayout={registrar('quantidade')}
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
      <CampoAutocompletar
        modo="unico"
        fonte="comoTomar"
        rotulo="Como tomar"
        placeholder="Ex.: Com refeição"
        valor={dados.comoTomar ?? ''}
        onAlterar={(comoTomar) => alterar('comoTomar', comoTomar)}
      />
      <CampoRotulado
        rotulo="Iniciado em"
        obrigatorio
        erro={erros.iniciadoEm}
        onLayout={registrar('iniciadoEm')}>
        <Calendario
          valor={dados.iniciadoEm}
          onEscolher={(data) => alterar('iniciadoEm', data)}
          maximo={new Date()}
        />
      </CampoRotulado>
      <CampoSelecao
        rotulo="Avisar de novo se não confirmar"
        opcoes={REAVISOS}
        valor={dados.reavisoMin}
        onAlterar={(minutos) => alterar('reavisoMin', minutos)}
      />
      <View onLayout={registrar('observacao')}>
        <CampoTexto
          rotulo="Observação"
          valor={dados.observacao ?? ''}
          onAlterar={(texto) => alterar('observacao', texto)}
          placeholder="Ex.: Tomar com um copo de água"
          multiline
          maxLength={LIMITE_OBSERVACAO}
          erro={erros.observacao}
        />
      </View>
    </>
  );
};
