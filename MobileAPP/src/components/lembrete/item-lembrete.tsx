import { router } from 'expo-router';

import { ArrastarParaRemover } from '@/components/agenda/arrastar-para-remover';
import { FundoExcluir } from '@/components/agenda/fundo-excluir';
import { GrupoAgendaCard } from '@/components/cards/grupo-agenda-card';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { horariosDoLembrete } from '@/utils/lembrete';

type ItemLembreteProps = {
  lembrete: Lembrete;
  tipos: TipoLembrete[];
  onAlternarAtivo: (id: string) => void;
  /** Recebe o id; pede confirmação antes de excluir. */
  onExcluir: (id: string) => void;
};

/**
 * Card da aba Lembretes (CARD-31): switch de alertas, deslizar para excluir e, para quem não
 * consegue deslizar, a ação "Excluir lembrete" no leitor de tela e o botão Excluir no detalhe.
 */
export const ItemLembrete = ({
  lembrete,
  tipos,
  onAlternarAtivo,
  onExcluir,
}: ItemLembreteProps) => (
  <ArrastarParaRemover
    chave={lembrete.id}
    onRemover={onExcluir}
    voltarAoSoltar
    fundo={<FundoExcluir />}>
    <GrupoAgendaCard
      lembrete={lembrete}
      tipos={tipos}
      horarios={
        lembrete.ativo
          ? horariosDoLembrete(lembrete).map((horario) => ({
              chave: horario,
              horario,
              estado: 'pendente',
            }))
          : []
      }
      onAbrir={() => router.push({ pathname: '/lembrete/[id]', params: { id: lembrete.id } })}
      onRemover={() => onExcluir(lembrete.id)}
      rotuloRemover="Excluir lembrete"
      consulta
      interruptor={{ ligado: lembrete.ativo, onAlternar: () => onAlternarAtivo(lembrete.id) }}
    />
  </ArrastarParaRemover>
);
