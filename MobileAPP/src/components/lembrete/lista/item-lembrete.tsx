import { router } from 'expo-router';

import { ArrastarParaRemover } from '@/components/agenda/arrastar-para-remover';
import { FundoExcluir } from '@/components/agenda/fundo-excluir';
import { GrupoAgendaCard } from '@/components/cards/grupo-agenda-card';
import type { Lembrete } from '@/types/lembrete';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { horariosDoLembrete } from '@/utils/lembrete/lembrete';

type ItemLembreteProps = {
  lembrete: Lembrete;
  tipos: TipoLembrete[];
  onAlternarAtivo: (id: string) => void;
  onExcluir: (id: string) => void;
};

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
