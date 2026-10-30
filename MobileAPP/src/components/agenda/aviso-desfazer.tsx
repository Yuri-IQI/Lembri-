import { StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';

export const AvisoDesfazer = () => {
  const { ultimoExcluido, desfazerExclusao } = useLembretesStore(
    useShallow((state) => ({
      ultimoExcluido: state.ultimoExcluido,
      desfazerExclusao: state.desfazerExclusao,
    }))
  );

  if (!ultimoExcluido) return null;

  return (
    <Card style={styles.aviso}>
      <ThemedText type="smallBold" style={styles.texto}>
        {`Lembrete "${ultimoExcluido.titulo}" excluído.`}
      </ThemedText>
      <Botao
        rotulo="Desfazer"
        tamanho="compacto"
        onPress={desfazerExclusao}
        accessibilityLabel={`Desfazer exclusão do lembrete ${ultimoExcluido.titulo}`}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  texto: {
    flex: 1,
  },
});
