import { StyleSheet, View, type ViewProps } from 'react-native';

import { Botao } from '@/components/botao';
import { CampoData } from '@/components/formulario/campo-data';
import { CampoSelecao } from '@/components/formulario/campo-selecao';
import { MensagemErro } from '@/components/formulario/mensagem-erro';
import { SeletorDias } from '@/components/formulario/seletor-dias';
import { Spacing } from '@/constants/theme';
import type { DiaSemana, Repeticao } from '@/types/lembrete';
import { chaveData } from '@/utils/data';

type Modo = Repeticao['modo'];

const OPCOES: { valor: Modo; rotulo: string }[] = [
  { valor: 'nao_repete', rotulo: 'Não repete' },
  { valor: 'todo_dia', rotulo: 'Todo dia' },
  { valor: 'dias', rotulo: 'Dias específicos' },
];

const FIM_DE_SEMANA: DiaSemana[] = [0, 6];

export type CampoRepeticaoProps = Pick<ViewProps, 'onLayout'> & {
  valor: Repeticao;
  onAlterar: (repeticao: Repeticao) => void;
  atalhoFimDeSemana?: boolean;
  erroDias?: string;
  erroData?: string;
};

const repeticaoDoModo = (modo: Modo, atual: Repeticao): Repeticao => {
  if (modo === atual.modo) return atual;
  if (modo === 'nao_repete') return { modo, data: chaveData(new Date()) };
  if (modo === 'dias') return { modo, dias: [] };
  return { modo };
};

/**
 * Repetição num select ("Não repete", "Todo dia", "Dias específicos"); abaixo dele aparecem a
 * data ou os dias da semana, quando a opção pede.
 */
export const CampoRepeticao = ({
  valor,
  onAlterar,
  atalhoFimDeSemana = false,
  erroDias,
  erroData,
  onLayout,
}: CampoRepeticaoProps) => (
  <View style={styles.container} onLayout={onLayout}>
    <CampoSelecao
      rotulo="Repetir"
      opcoes={OPCOES}
      valor={valor.modo}
      onAlterar={(modo) => onAlterar(repeticaoDoModo(modo, valor))}
    />
    {valor.modo === 'dias' && (
      <View style={styles.dias}>
        <SeletorDias
          rotulo=""
          selecionados={valor.dias}
          onAlterar={(dias) => onAlterar({ modo: 'dias', dias })}
        />
        {atalhoFimDeSemana && (
          <View style={styles.atalho}>
            <Botao
              rotulo="Fim de semana"
              variante="secundario"
              tamanho="compacto"
              accessibilityLabel="Marcar só sábado e domingo"
              onPress={() => onAlterar({ modo: 'dias', dias: FIM_DE_SEMANA })}
            />
          </View>
        )}
        {erroDias ? <MensagemErro mensagem={erroDias} /> : null}
      </View>
    )}
    {valor.modo === 'nao_repete' && (
      <CampoData
        rotulo="Data"
        obrigatorio
        valor={valor.data}
        onAlterar={(data) => onAlterar({ modo: 'nao_repete', data })}
        minimo={new Date()}
        erro={erroData}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  dias: {
    gap: Spacing.two,
  },
  atalho: {
    alignItems: 'flex-start',
  },
});
