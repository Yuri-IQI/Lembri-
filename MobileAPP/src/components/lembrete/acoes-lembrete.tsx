import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { Lembrete } from '@/types/lembrete';

export const AcoesLembrete = ({ lembrete }: { lembrete: Lembrete }) => {
  const removerLembrete = useLembretesStore((state) => state.removerLembrete);
  const [confirmando, setConfirmando] = useState(false);

  const excluir = () => {
    setConfirmando(false);
    removerLembrete(lembrete.id);
    router.back();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.acoes}>
      <Botao
        rotulo="Editar"
        icone="edit"
        accessibilityLabel={`Editar ${lembrete.titulo}`}
        onPress={() =>
          router.push({
            pathname: '/lembrete/editar/[id]' as const,
            params: { id: lembrete.id },
          })
        }
        style={styles.editar}
      />
      <Botao
        rotulo="Excluir"
        variante="perigo"
        accessibilityLabel={`Excluir ${lembrete.titulo}`}
        onPress={() => setConfirmando(true)}
      />
      <DialogoConfirmacao
        visivel={confirmando}
        titulo="Excluir lembrete?"
        mensagem={`"${lembrete.titulo}" e todos os seus horários (${lembrete.horarios.join(', ')}) serão excluídos. Você poderá desfazer na tela inicial.`}
        rotuloConfirmar="Excluir"
        varianteConfirmar="perigo"
        onConfirmar={excluir}
        onCancelar={() => setConfirmando(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  acoes: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  editar: {
    flex: 1,
  },
});
