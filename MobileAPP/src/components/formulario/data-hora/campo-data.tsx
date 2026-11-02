import { useState } from 'react';
import { View, type ViewProps } from 'react-native';

import { CaixaDialogo } from '@/components/feedback/caixa-dialogo';
import { Calendario } from '@/components/formulario/data-hora/calendario';
import { CampoTexto } from '@/components/formulario/texto/campo-texto';
import { formatarData } from '@/utils/tempo/data';
import { lerDataDigitada, mascararData } from '@/utils/texto/mascara';

export type CampoDataProps = Pick<ViewProps, 'onLayout'> & {
  rotulo: string;
  valor: string;
  onAlterar: (data: string) => void;
  minimo?: Date;
  maximo?: Date;
  obrigatorio?: boolean;
  erro?: string;
};

export const CampoData = ({
  rotulo,
  valor,
  onAlterar,
  minimo,
  maximo,
  obrigatorio,
  erro,
  onLayout,
}: CampoDataProps) => {
  const [texto, setTexto] = useState(valor ? formatarData(valor) : '');
  const [erroDigitado, setErroDigitado] = useState<string>();
  const [rascunho, setRascunho] = useState<string | null>(null);

  const digitar = (novo: string) => {
    const mascarado = mascararData(novo);
    const data = lerDataDigitada(mascarado);
    setTexto(mascarado);
    setErroDigitado(mascarado.length === 10 && !data ? 'Essa data não existe.' : undefined);
    onAlterar(data ?? '');
  };

  const escolher = (data: string) => {
    setTexto(formatarData(data));
    setErroDigitado(undefined);
    onAlterar(data);
  };

  return (
    <View onLayout={onLayout}>
      <CampoTexto
        rotulo={rotulo}
        obrigatorio={obrigatorio}
        valor={texto}
        onAlterar={digitar}
        placeholder="dd/mm/aaaa"
        keyboardType="number-pad"
        maxLength={10}
        erro={erroDigitado ?? erro}
        acao={{
          icone: 'calendar_month',
          rotulo: `Escolher ${rotulo.toLowerCase()} no calendário`,
          onPress: () => setRascunho(valor),
        }}
      />
      <CaixaDialogo
        visivel={rascunho !== null}
        titulo={rotulo}
        rotuloConfirmar="Escolher"
        onConfirmar={() => {
          if (rascunho) escolher(rascunho);
          setRascunho(null);
        }}
        onCancelar={() => setRascunho(null)}>
        <Calendario
          valor={rascunho ?? ''}
          onEscolher={setRascunho}
          minimo={minimo}
          maximo={maximo}
        />
      </CaixaDialogo>
    </View>
  );
};
