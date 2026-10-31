import { BlocoRotulado } from '@/components/bloco-rotulado';
import { ThemedText } from '@/components/themed-text';
import { descreverQuando, statusCompromisso } from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';

type BlocoProximaVezProps = {
  lembrete: Lembrete;
  proxima: OcorrenciaLembrete | null;
  agora: Date;
};

const SITUACAO_PASSADA = {
  concluido: { titulo: 'Concluído', apoio: 'Você marcou que foi a este compromisso.' },
  nao_confirmado: {
    titulo: 'Não confirmado',
    apoio: 'A data já passou e não foi marcado como feito.',
  },
};

export const BlocoProximaVez = ({ lembrete, proxima, agora }: BlocoProximaVezProps) => {
  const registros = useLembretesStore((state) => state.registros);
  const status = statusCompromisso(lembrete, registros, agora);

  if (status && status !== 'agendado') {
    const situacao = SITUACAO_PASSADA[status];
    return (
      <BlocoRotulado rotulo="Situação">
        <ThemedText type="title">{situacao.titulo}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {situacao.apoio}
        </ThemedText>
      </BlocoRotulado>
    );
  }

  return (
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
};
