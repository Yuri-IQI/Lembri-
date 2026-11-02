import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { CampoRotulado, type CampoRotuladoProps } from '@/components/formulario/base/campo-rotulado';
import { ItemChecklist } from '@/components/formulario/checklist/item-checklist';
import { ThemedText } from '@/components/themed-text';

export type CampoChecklistProps = {
  rotulo: string;
  itens: string[];
  onAlterar: (itens: string[]) => void;
  maximoItens: number;
  maximoCaracteres: number;
  erro?: string;
  onLayout?: CampoRotuladoProps['onLayout'];
};

export const CampoChecklist = ({
  rotulo,
  itens,
  onAlterar,
  maximoItens,
  maximoCaracteres,
  erro,
  onLayout,
}: CampoChecklistProps) => {
  const trocar = (indice: number, texto: string) =>
    onAlterar(itens.map((item, i) => (i === indice ? texto : item)));

  return (
    <CampoRotulado rotulo={rotulo} erro={erro} onLayout={onLayout}>
      {itens.map((item, indice) => (
        <ItemChecklist
          key={indice}
          posicao={indice + 1}
          texto={item}
          maximoCaracteres={maximoCaracteres}
          onAlterar={(texto) => trocar(indice, texto)}
          onRemover={() => onAlterar(itens.filter((_, i) => i !== indice))}
        />
      ))}
      <View style={styles.rodape}>
        {itens.length < maximoItens ? (
          <Botao
            rotulo="Adicionar"
            icone="add"
            variante="secundario"
            tamanho="compacto"
            accessibilityLabel={`Adicionar ${rotulo.toLowerCase()}`}
            onPress={() => onAlterar([...itens, ''])}
          />
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            {`Máximo de ${maximoItens} itens.`}
          </ThemedText>
        )}
      </View>
    </CampoRotulado>
  );
};

const styles = StyleSheet.create({
  rodape: {
    alignItems: 'flex-start',
  },
});
