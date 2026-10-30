import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BlocoRotulado } from '@/components/bloco-rotulado';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { descreverQuando } from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { formatarHora } from '@/utils/texto';

const LIMITE = 5;

type BlocoUltimasVezesProps = {
  lembreteId: string;
  agora: Date;
};

export const BlocoUltimasVezes = ({ lembreteId, agora }: BlocoUltimasVezesProps) => {
  const registros = useLembretesStore((state) => state.registros);
  const ultimas = useMemo(
    () =>
      registros
        .filter((registro) => registro.lembreteId === lembreteId)
        .sort((a, b) => b.previstoPara.localeCompare(a.previstoPara))
        .slice(0, LIMITE),
    [registros, lembreteId]
  );

  return (
    <BlocoRotulado rotulo="Últimas vezes">
      {ultimas.length === 0 ? (
        <ThemedText themeColor="textSecondary">Ainda não foi marcado como feito.</ThemedText>
      ) : (
        ultimas.map((registro) => (
          <View key={registro.chave} style={styles.registro}>
            <ThemedText style={styles.quando}>
              {descreverQuando(new Date(registro.previstoPara), agora)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {`feito às ${formatarHora(new Date(registro.feitoEm))}`}
            </ThemedText>
          </View>
        ))
      )}
    </BlocoRotulado>
  );
};

const styles = StyleSheet.create({
  registro: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  quando: {
    flex: 1,
  },
});
