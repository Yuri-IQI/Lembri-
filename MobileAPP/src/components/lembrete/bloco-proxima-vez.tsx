import { BlocoRotulado } from '@/components/bloco-rotulado';
import { ThemedText } from '@/components/themed-text';
import { descreverQuando } from '@/stores/agenda-lembretes';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';

type BlocoProximaVezProps = {
  lembrete: Lembrete;
  proxima: OcorrenciaLembrete | null;
  agora: Date;
};

export const BlocoProximaVez = ({ lembrete, proxima, agora }: BlocoProximaVezProps) => (
  <BlocoRotulado rotulo="Próxima vez">
    {lembrete.ativo ? (
      <ThemedText type="title">
        {proxima ? descreverQuando(proxima.quando, agora) : 'Sem alertas nos próximos 7 dias'}
      </ThemedText>
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
