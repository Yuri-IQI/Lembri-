import { StyleSheet, View } from 'react-native';

import { BlocoRotulado } from '@/components/bloco-rotulado';
import { MarcadorFeito } from '@/components/marcador-feito';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { descreverQuando } from '@/stores/agenda-lembretes';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';

type BlocoProximaVezProps = {
  lembrete: Lembrete;
  proxima: OcorrenciaLembrete | null;
  agora: Date;
  feito?: boolean;
  onAlternarFeito?: () => void;
};

export const BlocoProximaVez = ({
  lembrete,
  proxima,
  agora,
  feito = false,
  onAlternarFeito,
}: BlocoProximaVezProps) => (
  <BlocoRotulado rotulo="Próxima vez">
    {lembrete.ativo ? (
      <View style={styles.conteudoAtivo}>
        <ThemedText type="title" style={styles.textoQuando}>
          {proxima ? descreverQuando(proxima.quando, agora) : 'Sem alertas nos próximos 7 dias'}
        </ThemedText>
        {proxima && onAlternarFeito && (
          <MarcadorFeito
            feito={feito}
            onAlternar={onAlternarFeito}
            descricao={`Marcar como feito próximo alerta de ${lembrete.titulo}`}
          />
        )}
      </View>
    ) : (
      <>
        <ThemedText type="subheading">Alertas pausados</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Ligue o “Alertar” para voltar a receber este lembrete.
        </ThemedText>
      </>
    )}
  </BlocoRotulado>
);

const styles = StyleSheet.create({
  conteudoAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  textoQuando: {
    flex: 1,
  },
});
