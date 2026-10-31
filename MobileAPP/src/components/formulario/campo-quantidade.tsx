import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CampoAutocompletar } from '@/components/formulario/campo-autocompletar';
import { CampoRotulado, type CampoRotuladoProps } from '@/components/formulario/campo-rotulado';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { Spacing } from '@/constants/theme';
import { formatarDose, lerDose } from '@/utils/dose';

export type Quantidade = { valor: number; unidade: string };

type CampoQuantidadeProps = {
  quantidade: Quantidade;
  onAlterar: (quantidade: Quantidade) => void;
  erro?: string;
  onLayout?: CampoRotuladoProps['onLayout'];
};

/**
 * Dose do remédio numa linha: número digitado e a medida com sugestões.
 */
export const CampoQuantidade = ({
  quantidade,
  onAlterar,
  erro,
  onLayout,
}: CampoQuantidadeProps) => {
  const [texto, setTexto] = useState(quantidade.valor > 0 ? formatarDose(quantidade.valor) : '');

  const digitar = (novo: string) => {
    setTexto(novo);
    onAlterar({ ...quantidade, valor: lerDose(novo) });
  };

  return (
    <CampoRotulado rotulo="Quantidade" obrigatorio erro={erro} onLayout={onLayout}>
      <View style={styles.linha}>
        <View style={styles.numero}>
          <CampoTexto
            rotulo="Quantidade"
            rotuloOculto
            obrigatorio
            valor={texto}
            onAlterar={digitar}
            placeholder="1"
            keyboardType="decimal-pad"
            maxLength={5}
          />
        </View>
        <View style={styles.medida}>
          <CampoAutocompletar
            modo="unico"
            fonte="unidades"
            rotulo="Medida"
            rotuloOculto
            obrigatorio
            placeholder="Ex.: comprimido"
            valor={quantidade.unidade}
            onAlterar={(unidade) => onAlterar({ ...quantidade, unidade })}
          />
        </View>
      </View>
    </CampoRotulado>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  numero: {
    flex: 1,
  },
  medida: {
    flex: 2,
  },
});
