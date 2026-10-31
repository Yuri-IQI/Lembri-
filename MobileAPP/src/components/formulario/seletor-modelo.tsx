import { StyleSheet, View } from 'react-native';

import { ItemLista } from '@/components/item-lista';
import { Spacing } from '@/constants/theme';
import type { ModeloLembrete } from '@/types/modelo-lembrete';
import { descreverFrequencia } from '@/utils/frequencia';

export type SeletorModeloProps = {
  modelos: ModeloLembrete[];
  onEscolher: (modelo: ModeloLembrete) => void;
};

/**
 * Lista de modelos pré-definidos de lembrete utilizando o componente ItemLista (CARD-26).
 *
 * Apresenta o ícone simbólico, o nome do modelo e um subtítulo descritivo com os horários
 * e a frequência de repetição recomendados. Retorna null se a lista de modelos estiver vazia.
 */
export const SeletorModelo = ({ modelos, onEscolher }: SeletorModeloProps) => {
  if (modelos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {modelos.map((modelo) => {
        const frequencia = descreverFrequencia(modelo.dias);
        const subtitulo = `${modelo.horarios.join(', ')} · ${frequencia}`;

        return (
          <ItemLista
            key={modelo.id}
            icone={modelo.icone}
            titulo={modelo.nome}
            subtitulo={subtitulo}
            onPress={() => onEscolher(modelo)}
            accessibilityHint="Preenche o rascunho do lembrete com as informações deste modelo"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
