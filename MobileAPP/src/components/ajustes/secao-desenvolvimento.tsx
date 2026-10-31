import { StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Botao } from '@/components/botao';
import { Contador } from '@/components/formulario/contador';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { LIMITE_LEMBRETES_DEV, LIMITE_LEMBRETES_PADRAO } from '@/constants/limites';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Ajustes visíveis só em builds de desenvolvimento: limite de lembretes salvos.
 */
export const SecaoDesenvolvimento = () => {
  const { limite, definirLimite } = useSettingsStore(
    useShallow((state) => ({ limite: state.reminderLimit, definirLimite: state.setReminderLimit })),
  );
  const total = useLembretesStore((state) => state.lembretes.length);
  const { minimo, maximo, passo } = LIMITE_LEMBRETES_DEV;

  return (
    <Card style={styles.card}>
      <ThemedText type="subheading" accessibilityRole="header">
        Desenvolvimento
      </ThemedText>
      <Contador
        rotulo="Limite de lembretes"
        valor={String(limite)}
        onDiminuir={() => definirLimite(limite - passo)}
        onAumentar={() => definirLimite(limite + passo)}
        podeDiminuir={limite > minimo}
        podeAumentar={limite < maximo}
      />
      <ThemedText type="small" themeColor="textSecondary">
        {`${total} salvos. Padrão: ${LIMITE_LEMBRETES_PADRAO}. Baixar o limite não apaga lembretes; só impede criar novos.`}
      </ThemedText>
      <Botao
        rotulo="Restaurar padrão"
        variante="secundario"
        tamanho="compacto"
        onPress={() => definirLimite(LIMITE_LEMBRETES_PADRAO)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
});
